import { Component, OnInit, OnDestroy, ɵConsole } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DeleteItemComponent } from '../dialogs/delete-item/delete-item.component';
import { DataService } from '../services/menu.service';
import { Subscription } from 'rxjs';
import { Menu } from '../models/menu.model';
import { INVALID } from '@angular/forms/src/model';
@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent implements OnInit, OnDestroy {
  menusData: Menu[] = [];
  menuItems: any;
  form: FormGroup;
  mode: string = null;

  private menusSub: Subscription;

  inputDisabled: Boolean = true;
  submitted: Boolean = false;
  isLoading: Boolean = false;
  createMode: Boolean = false;
  isDuplicate: Boolean = false;
  selectedItem = null;

  constructor(private dataService: DataService, private formBuilder: FormBuilder, public dialog: MatDialog) {}

  ngOnInit() {
    this.submitted = false;
    this.form = this.formBuilder.group({
      title: [
        { value: '', disabled: this.inputDisabled },
        [(Validators.required, Validators.pattern('[a-zA-Z0-9 .]*'))]
      ],
      description: [
        { value: '', disabled: this.inputDisabled },
        [Validators.required, Validators.pattern('[a-zA-Z0-9 .]*')]
      ]
    });

    this.dataService.getMenus();
    this.isLoading = true;
    this.menusSub = this.dataService.getMenuUpdateListener().subscribe((menus: Menu[]) => {
      this.isLoading = false;
      this.menusData = menus;
      this.mode = null;
      this.submitted = false;
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  disableForm() {
    this.form.controls.title.reset({ value: this.selectedItem.title, disabled: true });
    this.form.controls.description.reset({ value: this.selectedItem.description, disabled: true });
  }

  enableForm() {
    this.form.controls.title.reset({ value: this.selectedItem.title, disabled: false });
    this.form.controls.description.reset({ value: this.selectedItem.description, disabled: false });
  }

  updateFormMode(mode) {
    if (mode === 'create') {
      this.createMode = true;
      this.inputDisabled = false;
      this.selectedItem = {};
      this.enableForm();
    }
    if (mode === 'edit') {
      this.inputDisabled = false;
      this.enableForm();
    }
    if (mode === 'view') {
      this.inputDisabled = true;
      this.disableForm();
    }
    if (mode === null) {
      this.inputDisabled = true;
      this.selectedItem = {};
      this.submitted = false;
      this.disableForm();
    }

    this.mode = mode;
    console.log(this.mode);
  }

  toggleEditTools() {}

  onItemSelect($event) {
    this.selectedItem = $event;
    this.updateFormMode('view');
    this.toggleEditTools();
    console.log(this.selectedItem);
  }

  onSaveMenu() {
    this.submitted = true;
    this.menuItems = null;
    if (this.form.invalid) {
      console.log('form is invalid');
      return;
    }

    // duplicate titles are not allowed.
    const duplicate = this.menusData.filter(menu => menu.title === this.form.value.title);

    if (duplicate.length === 0) {
      const newMenu = {
        _id: this.selectedItem._id,
        title: this.form.value.title,
        description: this.form.value.description,
        items: this.menuItems
      };
      console.log(newMenu);
      if (this.mode === 'view') {
      }
      if (this.mode === 'create') {
        this.dataService.addMenu(newMenu);
      }
      if (this.mode === 'edit') {
        this.dataService.updateMenu(newMenu);
      }
    } else {
      this.isDuplicate = true;
      // this generates a generic message
      this.form.controls['title'].setErrors({ incorrect: true });
    }
  }

  onDeleteMenu(id: String) {
    console.log(id);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.height = '20%';
    dialogConfig.width = '20%';
    dialogConfig.data = 'Type the word DELETE to delete this item';
    const dialogRef = this.dialog.open(DeleteItemComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(dialogReturnData => {
      console.log(dialogReturnData);
      if (dialogReturnData === 'DELETE') {
        this.dataService.deleteMenu(id);
      }
    });
    // this.dataService.deleteMenu(id);
  }

  ngOnDestroy() {
    this.menusSub.unsubscribe();
  }
}
