import { environment } from "./../environments/environment";
import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { Client } from "elasticsearch";
import "rxjs/add/operator/map";
import { Logger } from "@nsalaun/ng-logger";
//import { SharedService } from './shared.service';

@Injectable()
export class EsearchService {
  private host: string = environment.ELK_HOST;
  private port: string = environment.ELK_PORT;
  private baseURL: string = environment.ELK_URL;
  //OR "https://elastic:Xx9vKTTwUbNOT2iM4i8nSuEf@" +  environment.ELK_HOST +  ":" + environment.ELK_PORT
  
  client: Client;
  searchResults = [];
  resultCount = 0;

  queryalldocs = {
    query: {
      match_all: {}
    }
  };

  constructor(private _http: Http, private logger: Logger) {
    if (!this.client) {
      this.connect();
    }
  }

  private connect() {
    this.logger.info("elk base url: " + this.baseURL);
    this.client = new Client({
      host: this.baseURL,
      log: "trace"
    });
  }

  isAvailable(): any {
    return this.client.ping({
      requestTimeout: Infinity,
      body: "ELK available!"
    });
  }

  addToIndex(value): any {
    return this.client.create(value);
  }

  getAllDocumentsWithScroll(_index, _type, _size): any {
    return this.client.search({
      index: _index,
      type: _type,
      scroll: "1m",
      filterPath: ["hits.hits._source", "hits.total", "_scroll_id"],
      body: {
        size: _size,
        query: {
          match_all: {}
        },
        sort: [{ _uid: { order: "asc" } }]
      }
    });
  }

  getNextPage(scroll_id): any {
    return this.client.scroll({
      scrollId: scroll_id,
      scroll: "1m",
      filterPath: ["hits.hits._source", "hits.total", "_scroll_id"]
    });
  }

  fullTextSearch(_queryText): any {
    this.client
      .search({
        index: "books",
        type: "doc",
        q: _queryText,
        sort: "gsort:asc"
      })
      .then(response => {
        this.searchResults = response.hits.hits;
        this.resultCount = response.hits.total;
      });
    // first we do a search, and specify a scroll timeout
  }

  getChapter(book, cid): any {
    return this.client.search({
      index: "chapters",
      body: {
        query: {
          bool: {
            must: [{ term: { type: book } }, { term: { t_order: cid } }]
          }
        }
      }
    });
  }
  //  '_source': ['_id', 'q_order', 'r_order', 't_order', 'testament', 'ar_name', 'en_name', 'summary', 'synonyms']

  getChapterVerses(size, from, book, cid): any {
    return this.client.search({
      index: "books",
      body: {
        sort: [
          {
            gsort: {
              order: "asc"
            }
          }
        ],
        query: {
          bool: {
            must: [{ term: { type: book } }, { term: { chapter: cid } }],
            must_not: {
              term: { verse: 0 }
            }
          }
        }
      },
      size: size,
      from: from
    });
  }

  searchAll(queryTerm: string, size= 10000, from= 0): any {
    return this.client.search({
      index: "books",
      body: {
        sort: [
          {
            gsort: {
              order: "asc"
            }
          }
        ],
        query: {
          match : {
              message : queryTerm
          }
        },
        aggs: {
          chapter: {
            terms: {
              field: "chapter"
            }
          }
        }
      },
      size: size,
      from: from
    });
  }

  getActivityStream(): any {}

  updateVerse(id: string, data: any): any {
    const url: string = this.baseURL + "/books/doc" + id + "/_update";
    const headers = new Headers({ "Content-Type": "application/json" });
    const options = new RequestOptions({ headers: headers });
    this.logger.info("esrach.service::updateVerse - url: " + url);
    this.logger.info("esrach.service::updateVerse - data: " + data);

    return this._http.post(url, data, options).map(res => res.json());
  }

  addLike(verseID: string, usr: string): any {
    const url: string = this.baseURL + "/likes/_doc/";
    const headers = new Headers({ "Content-Type": "application/json" });
    const options = new RequestOptions({ headers: headers });
    const data = {
      parentVerseId: verseID,
      user: usr,
      timestamp: new Date()
    };
    return this._http.post(url, data, options).map(res => res.json());
  }

  addComment(verseID: string, userComment: string): any {
    const url: string = this.baseURL + "/comments/_doc/";
    const headers = new Headers({ "Content-Type": "application/json" });
    const options = new RequestOptions({ headers: headers });
    const data = {
      parentVerseId: verseID,
      user: "mdarwish",
      timestamp: new Date(),
      comment: userComment,
      totalLikes: 0,
      likes: [],
      totalReplies: 0,
      replies: []
    };
    return this._http.post(url, data, options).map(res => res.json());
  }

  getLikesCount(verseID: string, user: string): any {
    const url: string = this.baseURL + "/likes/_count?q=parentVerseId:" + verseID + ",user:" + user;
/*     const headers = new Headers({ "Content-Type": "application/json" });
    const options = new RequestOptions({ headers: headers });
 */
    return this._http.get(url).map(res => res.json());
  }

  getCommentsCount(verseID: string): any {
    const url: string = this.baseURL + "/comments/_count?q=parentVerseId:" + verseID;
    this.logger.info("Comments Count url: " + url);
/*     const headers = new Headers({ "Content-Type": "application/json" });
    const options = new RequestOptions({ headers: headers });
 */
    return this._http.get(url).map(res => res.json());
  }

  getComments(verseID: string): any {
    const url: string = this.baseURL + "/comments/_search?sort=timestamp:desc&q=parentVerseId:" + verseID;
/*     const headers = new Headers({ "Content-Type": "application/json" });
    const options = new RequestOptions({ headers: headers });
 */
    this.logger.info("Comments url: " + url);
    
    return this._http.get(url).map(res => res.json());
  }

  getChaptersMeta() {
    const url: string = this.baseURL + "/chapters/_search?size=180&sort=q_order";

    return this._http.get(url).map(res => res.json());
  }

  getBookChapters(size, from, book): any {
    return this.client.search({
      index: "chapters",
      body: {
        sort: [
          {
            q_order: {
              order: "asc"
            }
          }
        ],
        query: {
          bool: {
            must: [{ term: { type: book } }]
          }
        }
      },
      size: size,
      from: from
    });
  }
}

