import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BranchListPage } from './branch-list';
import { RouterModule, Routes } from '@angular/router';
import { PipesModule } from '../../pipes/pipes.module';

const routes: Routes = [
    {
      path: '',
      component: BranchListPage
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class BranchRoutingModule { }

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    BranchRoutingModule,
    PipesModule
  ],
  declarations: [BranchListPage],
})
export class BranchModule {}

