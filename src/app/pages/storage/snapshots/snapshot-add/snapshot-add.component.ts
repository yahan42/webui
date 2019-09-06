import { AfterViewInit, ApplicationRef, Component, Injector, OnDestroy } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { T } from 'app/translate-marker';
import { map } from 'rxjs/operators';
import helptext from '../../../../helptext/storage/snapshots/snapshots';
import { DialogService, RestService, WebSocketService } from '../../../../services/';
import { EntityFormComponent, Formconfiguration } from '../../../common/entity/entity-form/entity-form.component';
import { FieldConfig } from '../../../common/entity/entity-form/models/field-config.interface';
import { EntityUtils } from '../../../common/entity/utils';

@Component({
  selector: 'app-snapshot-add',
  templateUrl: './snapshot-add.component.html'
})

export class SnapshotAddComponent implements AfterViewInit, Formconfiguration, OnDestroy {
  public route_success = ['storage', 'snapshots'];
  public isEntity = true;
  public isNew = true;
  public fieldConfig: FieldConfig[] = [];
  public initialized = true;
  public addCall = 'zfs.snapshot.create';

  protected naming_schema_subscription: any;
  protected naming_schema_fg: any;

  private entityForm: EntityFormComponent;
  private nameValidator: ValidatorFn;

  constructor(protected router: Router, protected route: ActivatedRoute,
    protected rest: RestService, protected ws: WebSocketService,
    protected _injector: Injector, protected _appRef: ApplicationRef, protected dialog: DialogService) {

    this.fieldConfig = [
      {
        type: 'select',
        name: 'dataset',
        placeholder: helptext.snapshot_add_dataset_placeholder,
        tooltip: helptext.snapshot_add_dataset_tooltip,
        options: [],
        validation: helptext.snapshot_add_dataset_validation,
        required: true
      },
      {
        type: 'input',
        name: 'name',
        placeholder: helptext.snapshot_add_name_placeholder,
        tooltip: helptext.snapshot_add_name_tooltip,
        options: [],
        validation: this.nameValidator,
        errors: T('Name or Naming Schema is required. Only one field can be used at a time.'),
        blurStatus: true,
        blurEvent: this.updateNameValidity.bind(this)
      },
      {
        type: 'select',
        name: 'naming_schema',
        placeholder: helptext.snapshot_add_naming_schema_placeholder,
        tooltip: helptext.snapshot_add_naming_schema_tooltip,
        options: [],
        onChangeOption: this.updateNameValidity.bind(this)
      },
      {
        type: 'input',
        name: 'new_naming_schema',
        placeholder: helptext.snapshot_add_new_naming_schema_placeholder,
        tooltip: helptext.snapshot_add_new_naming_schema_tooltip,
        isHidden: true,
        disabled: true,
        value: 'auto-%Y-%m-%d_%H-%M',
        blurEvent: this.updateNameValidity.bind(this)
      },
      {
        type: 'checkbox',
        name: 'recursive',
        value: false,
        placeholder: helptext.snapshot_add_recursive_placeholder,
        tooltip: helptext.snapshot_add_recursive_tooltip,
      }
    ];
  }

  ngAfterViewInit(): void {
    this.rest.get("storage/volume/", {}).subscribe((res) => {
      const rows = new EntityUtils().flattenData(res.data);

      rows.forEach((dataItem) => {
        if (typeof (dataItem.path) !== 'undefined' && dataItem.path.length > 0) {
          this.fieldConfig[0].options.push({
            label: dataItem.path,
            value: dataItem.path
          });
        }
      })

      this.initialized = true;
    });

    this.ws
      .call("replication.list_naming_schemas", [])
      .pipe(map(new EntityUtils().array1DToLabelValuePair))
      .subscribe(
        options => {
          this.fieldConfig.find(config => config.name === "naming_schema").options = [
            { label: "---", value: undefined },
            ...options,
            { label: "Create New", value: "create_new"}
          ];
        },
        error => new EntityUtils().handleWSError(this, error, this.dialog)
      );
  }

  afterInit(entityForm: EntityFormComponent) {
    this.entityForm = entityForm;
  
    const nameControl = this.entityForm.formGroup.get('name');
    const nameConfig = this.fieldConfig.find(config => config.name === 'name');
    const namingSchemaControl = this.entityForm.formGroup.get('naming_schema');
    const newNamingSchemaControl = this.entityForm.formGroup.get('new_naming_schema');

    this.nameValidator = (nc: FormControl): { [error_key: string]: string } | null => {  
      if (!!nc.value && !!namingSchemaControl.value) {
        nameConfig.hasErrors = nc.touched;
        return {
          duplicateNames: T('Name and Naming Schema cannot be provided at the same time.')
        }
      }
 
      console.log(newNamingSchemaControl);
      if (!nc.value && 
            (!namingSchemaControl.value 
             || (namingSchemaControl.value === 'create_new'
                 && !newNamingSchemaControl.value))) {
        nameConfig.hasErrors = nc.touched;
        return {
          nameRequired: T('Name or Naming Schema must be provided.')
        }
      }
  
      nameConfig.hasErrors = false;
      return null;
    }

    nameControl.setValidators(this.nameValidator.bind(this));

    this.naming_schema_subscription = namingSchemaControl.valueChanges.subscribe(value => {
      const new_naming_schema = (value !== 'create_new');
      this.entityForm.setDisabled('new_naming_schema', new_naming_schema, new_naming_schema);
    });
  }

  beforeSubmit(snapshot): void {
    if (!snapshot.name) {
      delete snapshot.name;
    } else if (!snapshot.naming_schema) {
      delete snapshot.naming_schema;
    } 
    if (snapshot.naming_schema === 'create_new') {
      snapshot.naming_schema = snapshot.new_naming_schema;
      delete snapshot.new_naming_schema;
    }
  }

  updateNameValidity() {
    this.entityForm.formGroup.get('name').updateValueAndValidity();
  }

  ngOnDestroy() {
    this.naming_schema_subscription.unsubscribe();
  }
}
