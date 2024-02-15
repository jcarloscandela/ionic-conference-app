import { Component } from '@angular/core';
import { BranchService } from '../../services/branch.service';
import { Branch } from '../../interfaces/branch';

@Component({
  selector: 'page-branch-list',
  templateUrl: 'branch-list.html',
  styleUrls: ['./branch-list.scss'],
})
export class BranchListPage {
  branches: Branch[] = [];

  constructor(private _branchService: BranchService) {}

  ionViewDidEnter() {
    this.refreshBranches();
  }

  async refreshBranches() {
    this._branchService.isStorageReady().subscribe(async ready => {
      if (ready) {
        this.branches = await this._branchService.getAllBranches();
      }
    });
  }

  async addBranch() {
    const newBranch: Branch = {
      owner: 'DevExpress',
      repo: 'devextreme-ui-template-gallery',
      branch: 'master'
    };
    
    await this._branchService.saveBranch(newBranch); 
    await this.refreshBranches();
  }

  async deleteBranch(branch: Branch) {
    await this._branchService.deleteBranch(branch);
    await this.refreshBranches();
  }
}