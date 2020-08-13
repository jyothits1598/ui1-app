import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss']
})
export class SideNavBarComponent implements OnInit {
  storeNames = new Array();
  public show:boolean = false;
  public buttonName:any = 'Show';

  dashboard_url:string = "/dashboard";
  menu_url:string = "/dashboard/stores/";
  dashboard_status:boolean = false;
  menu_status:boolean = false;

  constructor(
    private authenticateService: AuthenticationService,
    private dataService: DataService,
    private restapiService: RestApiService,
    private router: Router,
    private alertService: AlertService,
    private storeService: StoreService,
    private route: ActivatedRoute,
  ) { 
    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          this.dashboard_status = false;
          this.menu_status = false;
          if(this.router.url && this.router.url == this.dashboard_url){
            this.dashboard_status = true;
          }else if(this.router.url && this.router.url.indexOf(this.menu_url) > -1){
              this.menu_status = true;
          }
        }
      }
    );
    
  }

  get storeSer(){
    return this.storeService;
  }

  ngOnInit(): void {
    var obj = this;
    obj.authenticateService.getUserObject().subscribe((response)=>{
      if(response && response['user_details'] && response['user_details']['store_partner_id']){
        // console.log(response['user_details']['store_partner_id']);
        // obj.storeDetails();
      }else{
        return obj.router.navigate(['/login']);
      }
    });
  }

    storeDetails() {
      this.alertService.showLoader();
      this.restapiService.getData('store/all',(response)=>{
        if(response && response['success'] && response['data'] && Array.isArray(response['data']) && response['data'].length > 0){
          this.storeNames = response['data'];
          this.storeService.stores = response['data'];
          this.alertService.hideLoader();
        }
      });
    }
   /*
    * Logout function 
    */
  logout(){
    this.authenticateService.logout();
  }

  toggleMenu() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
  

}
