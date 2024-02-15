import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GithubBranch } from '../interfaces/branch';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private apiUrl = 'https://api.github.com';

  constructor(private http: HttpClient) { }

  // Function to get the SHA of a branch
  getBranch(owner: string, repo: string, branch: string): Observable<GithubBranch> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/branches/${branch}`;
    return this.http.get<GithubBranch>(url);
  }
}