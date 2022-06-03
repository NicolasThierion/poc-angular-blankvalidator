import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';

import { map, distinctUntilChanged, skip } from 'rxjs/operators';

interface BlankAware {
  blank: boolean;
}

const disableValidationIfBlank = (
  formGroup: FormGroup,
  ...validators: ValidatorFn[]
) => {
  const blankAware = formGroup as FormGroup & BlankAware;

  return ((control) => {
    if (control.value === '') {
      if (!blankAware.blank) {
        formGroup.updateValueAndValidity({ onlySelf: true });

        blankAware.blank = isBlank(formGroup.value);
        if (blankAware.blank) {
          Object.values(formGroup.controls).forEach((c) =>
            c.updateValueAndValidity({
              onlySelf: true,
            })
          );
        }
      }
    } else if (blankAware.blank) {
      blankAware.blank = false;
      Object.values(formGroup.controls).forEach((c) =>
        c.updateValueAndValidity({
          onlySelf: true,
        })
      );
    }

    return blankAware.blank
      ? () => null
      : validators
          .map((v) => v(control))
          .reduce((v, errors) => {
            v = Object.assign({}, v, errors);

            return v === {} ? {} : v;
          }, null);
  }) as ValidatorFn;

  function isBlank(model: Record<string, unknown>) {
    return !Object.values(model).filter((v) => v !== '').length;
  }
};

export class AppFormGroup extends FormGroup {
  constructor() {
    super({});
    this.addControl(
      'firstname',
      new FormControl('', [disableValidationIfBlank(this, Validators.required)])
    );
    this.addControl(
      'lastname',
      new FormControl('', [disableValidationIfBlank(this, Validators.required)])
    );
  }
}
