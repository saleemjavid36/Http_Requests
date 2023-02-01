import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Subject,catchError,throwError,tap} from "rxjs";
import { Post } from "./post.model";

@Injectable({
    providedIn:'root'
})
export class PostService{

    
    error = new Subject<any>()

    constructor(private http:HttpClient) {}

    createAndStorePost(title:string,content:string){
        //...sent http req
    const postData:Post={title:title,content:content}

    console.log(postData);
    this.http.post<{name:string}>('https://ng-complete-guide-e481e-default-rtdb.firebaseio.com/posts.json',
    postData,
    {
        observe:'response'
    }
    )
    
    .subscribe(responseData=>{
      console.log(responseData)
    },error=>{
        this.error.next(error.message)
    })
    }
    
    
    fetchPosts(){

        let searchParms= new HttpParams();
        searchParms = searchParms.append('print','pretty')
        searchParms = searchParms.append('custom','key')
        //...
        return this.http
        .get<{[key:string]:Post}>('https://ng-complete-guide-e481e-default-rtdb.firebaseio.com/posts.json',
        {
            headers:new HttpHeaders({'Custom-header':'hello'}),
            params:searchParms,
            responseType:'json'
        }
        )
        .pipe(
          map(responseData=>{
          console.log(responseData)
          const postsArray:Post[]=[];
          for(const key in responseData){
            if(responseData.hasOwnProperty(key)){
              postsArray.push({ ...responseData[key],id:key})
            }
            
          }
          return postsArray
        }),catchError(errorRes=>{
            return throwError(errorRes)
        }))
        // i dont subscribe here instead i return only prepared observable here in fetch post sand 
        // there for right now no Http Requests gets SEnt
        //  as req only sent when someone is intrested
    }
    deletePosts(){
        return this.http.delete('https://ng-complete-guide-e481e-default-rtdb.firebaseio.com/posts.json',
        {
            observe:"events",
            responseType:'text'
        }
        ).pipe(
            tap(event=>{
            console.log(event);
            if(event.type === HttpEventType.Sent){
                console.log(event)
            }
            if(event.type===HttpEventType.Response){}
        }))
    }
}