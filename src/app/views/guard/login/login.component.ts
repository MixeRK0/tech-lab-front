import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '@services/auth.service';

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  public model = {
    email: '',
    password: ''
  };

  public loading = false;

  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  public Login() {
    this.loading = true;
    this.authService.login(this.model)
      .subscribe(
        () => {
          this.loading = false;
          this.router.navigate(['']);
        },
        () => {
          this.loading = false;
        }
      );
  }

  GoToRequestResetPassword() {
    this.router.navigate(['guard', 'request-password-reset']);
  }
}
