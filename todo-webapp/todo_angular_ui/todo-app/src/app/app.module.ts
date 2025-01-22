import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { StoreModule } from "@ngrx/store";
import { taskReducer } from "../shared/reducers/tasks.reducer";
import { EffectsModule } from "@ngrx/effects";
import { TasksEffects } from "../shared/effects/tasks.effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { AppRoutingModule } from "./app.routing";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        DragDropModule,
        StoreModule.forRoot({ tasks: taskReducer }),
        EffectsModule.forRoot([TasksEffects]),
        StoreDevtoolsModule.instrument({ maxAge: 25 }),
        RouterModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})


export class AppModule { }