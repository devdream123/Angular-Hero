import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

import { HeroService } from './hero.service';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { HeroSearchService } from './hero-search.service';
import { Hero } from './hero';

@Component({
    selector: 'hero-search',
    templateUrl: './hero-search.component.html',
    styleUrls:['./hero-search.component.css'],
    providers: [HeroSearchService]
})
export class HeroSearchComponent implements OnInit {
    heroes: Observable<Hero[]>;
    private searchTerms = new Subject<string>();

    constructor(
        private heroSearchService:HeroSearchService,
        private router: Router) { }

    // Push a search term into the observable stream.
    search(term:string):void{
        this.searchTerms.next(term);
        console.log("In search method");
    }
    ngOnInit() : void { 
        console.log("In ngOnInit method");        
        this.heroes = this.searchTerms
            .debounceTime(300) // wait 300ms after each keystroke before considering the term
            .distinctUntilChanged() // ignore if next search term is same as previous
            .switchMap(term => term // switch to new observable each time the term changes
            ? this.heroSearchService.search(term) // return the http search observable
            : Observable.of<Hero[]>([])) // or the observable of empty heroes if there was no search term
            .catch(error => {
                // TODO: add real error handling
                console.log(error);
                return Observable.of<Hero[]>([]);
            });
    }
    gotoDetail(hero:Hero):void{
        let link = ['/detail',hero.id];
        this.router.navigate(link);


    }

}