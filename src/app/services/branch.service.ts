import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Branch } from '../interfaces/branch';
import { ToastController } from '@ionic/angular';
import { GithubService } from './github.service';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private storageInitialized = new BehaviorSubject<boolean>(false);
  private branchesKey = 'branches'; // Use a constant key for all branches

  constructor(
    private storage: Storage, 
    private toastController: ToastController,
    private githubService: GithubService) {
    this.init();
  }

  async init() {
    await this.storage.create();
    this.storageInitialized.next(true);
  }

  // Add or update a branch
  async saveBranch(branch: Branch): Promise<void> {
    const branches = await this.getBranchesArray();
    const index = branches.findIndex(b => b.owner === branch.owner && b.repo === branch.repo && b.branch === branch.branch);
  
    // Fetch branch information from GitHub
    const branchInfo = await this.githubService.getBranch(branch.owner, branch.repo, branch.branch).toPromise();
  
    if (index !== -1) {
      // The branch exists in our storage
      console.log(branchInfo.commit.sha, branches[index].sha);
      if (branchInfo.commit.sha !== branches[index].sha) {
        // The SHA from GitHub is different from our stored SHA, update the branch
        branches[index].sha = branchInfo.commit.sha;
        branches[index].commitDate = branchInfo.commit.commit.author.date;
        branches[index].lastUpdated = new Date().toISOString();

        await this.storage.set(this.branchesKey, JSON.stringify(branches));
        await this.showInfoToast('Branch updated successfully.');
      } else {
        // The stored branch is up to date with GitHub, no need to update
        await this.showInfoToast('Branch already exists and is up to date.');
        return; // Early return to avoid further processing
      }
    } else {
      // The branch does not exist in our storage, add it as a new branch
      branch.sha = branchInfo.commit.sha;
      branch.commitDate = branchInfo.commit.commit.author.date;
      branch.lastUpdated = new Date().toISOString();

      branches.push(branch);
      await this.storage.set(this.branchesKey, JSON.stringify(branches));
      await this.showInfoToast('Branch added successfully.');
    }
  }

  // Helper method to get the branches array from storage
  private async getBranchesArray(): Promise<Branch[]> {
    const branchesJson = await this.storage.get(this.branchesKey);
    return branchesJson ? JSON.parse(branchesJson) : [];
  }

  // Get all branches
  async getAllBranches(): Promise<Branch[]> {
    return await this.getBranchesArray();
  }

  // Delete a branch by its composite identifier
  async deleteBranch(branch: Branch): Promise<void> {
    let branches = await this.getBranchesArray();
    branches = branches.filter(b => !(b.owner === branch.owner && b.repo === branch.repo && b.branch === branch.branch));
    await this.storage.set(this.branchesKey, JSON.stringify(branches));
  }

  // Check if the storage is ready
  isStorageReady(): Observable<boolean> {
    return this.storageInitialized.asObservable();
  }

  private async showInfoToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration in milliseconds
      position: 'bottom', // Position of toast
    });
    toast.present();
  }
}