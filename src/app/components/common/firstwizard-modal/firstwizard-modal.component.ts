import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../services/';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EntityFormService } from '../../../pages/common/entity/entity-form/services/entity-form.service';
import { FieldRelationService } from '../../../pages/common/entity/entity-form/services/field-relation.service';

import { ModalService } from '../../../services/modal.service';
import { RestService, WebSocketService } from '../../../services';

import { EntityWizardComponent } from '../../../pages/common/entity/entity-wizard/entity-wizard.component';
import { Wizard } from '../../../pages/common/entity/entity-form/models/wizard.interface';
import { AppLoaderService } from 'app/services';
import { T } from '../../../translate-marker';

@Component({
    selector: 'firstwizard-modal',
    templateUrl: './firstwizard-modal.component.html',
    styleUrls: ['./firstwizard-modal.component.css'],
    providers: [EntityFormService, FieldRelationService]

})
export class FirstWizardModalComponent extends EntityWizardComponent implements OnInit, OnDestroy {
    @Input() id: string;
    public conf = this;
    private element: any;

      public summary = {};
    isLinear = true;
    firstFormGroup: FormGroup;
    protected dialogRef: any;
    objectKeys = Object.keys;
    summary_title = "Onboarding Wizard Summary";
    public subs: any;
    public saveSubmitText = T("Finish");
    public entityWizard: any;
    protected productType: any;
    protected importIndex = 2;

    public wizardConfig: Wizard[] = [{
        label: 'foo',
        fieldConfig: [
          {
            type: 'input',
            name: 'dummy',
            placeholder: 'test',
          },
        ]
      }];

    constructor(rest: RestService, ws: WebSocketService,
        formBuilder: FormBuilder, entityFormService: EntityFormService,
        loader: AppLoaderService, fieldRelationService: FieldRelationService,
        router: Router, aroute: ActivatedRoute,
        dialog: DialogService, translate: TranslateService,
        private modalService: ModalService, private el: ElementRef) {
        super(rest, ws, formBuilder, entityFormService, loader, fieldRelationService, router, aroute, dialog, translate);
        this.element = el.nativeElement;
    }

    ngOnInit(): void {
        let modal = this;

        // ensure id attribute exists
        if (!this.id) {
            console.error('modal must have an id');
            return;
        }

        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        document.body.appendChild(this.element);

        // close modal on background click
        this.element.addEventListener('click', function (e: any) {
            if (e.target.className === 'firstwizard-modal') {
                modal.close();
            }
        });

        // add self (this modal instance) to the modal service so it's accessible from controllers
        this.modalService.add(this);
        super.ngOnInit();
    }

    // remove self from modal service when component is destroyed
    ngOnDestroy(): void {
        this.modalService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('firstwizard-modal-open');
    }

    // close modal
    close(): void {
        this.element.style.display = 'none';
        document.body.classList.remove('firstwizard-modal-open');
    }
} 