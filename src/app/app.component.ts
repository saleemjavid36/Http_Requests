import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { Post } from './post.model';
import { PostService } from './post.serivce';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit ,OnDestroy{
  loadedPosts: Post[]= [];
  isFetching=false;
  error=null;
  private errorSub:Subscription | any


  constructor(private http:HttpClient,private postService:PostService) {}
  
  ngOnDestroy() {
    this.errorSub.unsubscribe()
  }

  ngOnInit() {
    this.errorSub=this.postService.error.subscribe(errorMessage=>{
      this.error=errorMessage
    })
    this.isFetching=true
    this.postService.fetchPosts().subscribe(
      posts=>{
       this.isFetching=false
       this.loadedPosts=posts
      },error=>{
        this.error= error.message
      }
    )
  }
  // { title: string; content: string }
  onCreatePost(postData: Post) {
    // Send Http request
    this.postService.createAndStorePost(postData.title,postData.content)
  }

  onFetchPosts() {
    // Send Http request
    this.postService.fetchPosts().subscribe(
      posts=>{
       this.isFetching=false
       this.loadedPosts=posts
      },error=>{
        this.error=error.message
        this.isFetching= false
      }
    )
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePosts().subscribe(()=>{
      this.loadedPosts=[];
    })
  }

  onHandleError(){
    this.error=null
  }
 
 }
// this.isFetching=false;
// this.loadedPosts = posts;