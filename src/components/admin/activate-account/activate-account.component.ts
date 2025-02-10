import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import { IResponse } from '../../../shared/interfaces/response-i';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-activate-account',
  imports: [],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss',
})
export class ActivateAccountComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private _snackbar: SnackbarService,
    private router: Router
  ) {
    const token = this.activatedRoute.snapshot.paramMap.get('token');
    if (token) {
      this.activateAccount(token);
    }
  }

  activateAccount(token: string) {
    this.commonService.activateAccount(token).subscribe({
      next: (response: IResponse<any>) => {
        if (response?.success == 1) {
          this._snackbar.success(response?.msg);
          this.router.navigate(['/admin/signin']);
        }
      },
      error: (err) => {
        this._snackbar.error(
          err?.msg || 'Something went wrong, please try again later'
        );
        this.router.navigate(['/admin/signin']); 
      },
    });
  }
}
