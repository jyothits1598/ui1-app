import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpHeaderResponse } from '@angular/common/http';
import { API_URL_LINK } from '../../environments/environment';
import { Subject } from 'rxjs';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  hostURL = API_URL_LINK;
  private unsubscribe$ = new Subject();

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertservice: AlertService,
  ) { }

  /*
    * Function to get header data
    */
   getHeader(){
    let auth;
    if (localStorage.getItem('Audit_Auth'))
        auth = localStorage.getItem('Audit_Auth');
    return auth;
  }

  /*
    * Rest API Function to post some data
    */
   async postAPI(url,data,callback){
    url = this.hostURL+url;
    let cred = this.getHeader() ? JSON.parse(this.getHeader()) : {};
    const headers = new HttpHeaders(cred);
    await this.http.post(url, data,{headers : headers}).subscribe(response => {
        return callback && callback(response);
    },error => {
        this.alertservice.hideLoader();
        if(error.error){
            return callback && callback(error);
        }else{
            this.alertservice.showNotification('Something went wrong, please try again','error');
        }
    });
  }
  async postAPIHandler(url,data,callback){
    url = this.hostURL+url;
    let cred = this.getHeader() ? JSON.parse(this.getHeader()) : {};
    const headers = new HttpHeaders(cred);
    await this.http.post(url, data,{headers : headers}).subscribe(response => {
        return callback && callback(response);
    },error => {
        this.alertservice.hideLoader();
        if(error.error){
            return callback && callback(error);
        }else{
            this.alertservice.showNotification('Please check your connection,try again','error');
        }
    });
  }

  /*
    * Rest API Function to get data based on url
    */
   async getData(url,callback) {
    url = this.hostURL+url;
    let cred = this.getHeader() ? JSON.parse(this.getHeader()) : {};
    const headers = new HttpHeaders(cred);
    await this.http.get(url,{headers : headers}).subscribe((response) => {
        return callback && callback(response);
    },error => {
        this.alertservice.hideLoader();
        if(error && error.status && (error.status==404)){
            // return this.router.navigateByUrl('/page-not-found');
        }else if(error && error.status && (error.status==400)){
            // return this.router.navigateByUrl('/page-not-found');
        } else if(error && error.status && (error.status==422)){
        }else{
            this.alertservice.showNotification('Please check your connection,try again','error');
        }
    });
  }

  /*
    * Rest API Function to PUT some data
    */
   async putAPI(url,data,callback){
    url = this.hostURL+url;
    let cred = this.getHeader() ? JSON.parse(this.getHeader()) : {};
    const headers = new HttpHeaders(cred);
    await this.http.put(url, data,{headers : headers}).subscribe(response => {
        return callback && callback(response);
    },error => {
        this.alertservice.hideLoader();
        if(error.error){
            return callback && callback(error);
        }else{
            this.alertservice.showNotification('Something went wrong, please try again','error');
        }
    });
  }

  /*
    * Rest API Function to Delete
    */
   async deleteAPI(url,callback){
    url = this.hostURL+url;
    let cred = this.getHeader() ? JSON.parse(this.getHeader()) : {};
    const headers = new HttpHeaders(cred);
    await this.http.delete(url,{headers : headers}).subscribe(response => {
        return callback && callback(response);
    },error => {
        this.alertservice.hideLoader();
        if(error.status==200){
            return callback && callback({'msg':'success'});
        }else{
            this.alertservice.showNotification('Something went wrong, please try again','error');
            return callback && callback({'msg':'fail'});
        }
    });
  }

    /*
        * Rest API Function to save file to storage using form data object
        */
    async pushSaveFileToStorage(file,url,callback){
        url = this.hostURL+url;
        let formdata = new FormData();
        formdata.append('profile_image', file);
        let cred = this.getHeader() ? JSON.parse(this.getHeader()) : {};
        const headers = new HttpHeaders(cred);
        headers.append('Content-Type', 'application/form-data');
        // reportProgress: true,observe: 'events'
        await this.http.post(url, formdata, {headers:headers}).subscribe(
            (data) => {
                return callback && callback(data); 
            },error => {
                this.alertservice.hideLoader();
                console.log(error);
            }
        );
    }

    /*
    * Rest API Function to save file to storage using get form data object
    */
    async pushSaveFileToStorageWithFormdata(formdata,url,callback){
    url = this.hostURL+url;
    let cred = this.getHeader() ? JSON.parse(this.getHeader()) : {};
    // x-www-form-urlencoded
    // cred['Content-Type'] ? cred['Content-Type']='application/form-data' : cred['Content-Type']=cred['Content-Type'];
    const headers = new HttpHeaders(cred);
    // headers.append('Content-Type', 'application/form-data');
    await this.http.post(url, formdata, {headers:headers}).subscribe(
        (data) => {
            return callback && callback(data); 
        },error => {
            this.alertservice.hideLoader();
            if(error.error.data){
                this.alertservice.showNotification(error.error.data,'error');
            }
            if(error.error.error){
                this.alertservice.showNotification(error.error.error,'error');
            }
            if(error.error.error['excel_file']['0']){
                var errorMez = error.error.error['excel_file']['0'];
                if(errorMez == 'The excel file must be a file of type: xlsx, xls.') {
                    var displayName = 'Upload file format is Wrong';
                    this.alertservice.showNotification(displayName,'error');
                }
            }
        }
    );
}
  /*
    * Function to get logged user details
    */
   getOfflineLoggedUserDetails(){
    if(localStorage.getItem('loggedUser')){
        var user_details=JSON.parse(localStorage.getItem('loggedUser'));
        return user_details;
    }
    return [];
}

   /*
    * default Angular Destroy Method
    */
   ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
