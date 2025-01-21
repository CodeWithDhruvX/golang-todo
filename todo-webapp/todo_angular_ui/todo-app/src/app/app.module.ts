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


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        StoreModule.forRoot({task:taskReducer}), // setup the global state management using NGRX
        EffectsModule.forRoot([TasksEffects]), // handles side effects like API calls,logging in reponse to actions dispatched to the store
        StoreDevtoolsModule.instrument({maxAge:25})// integrate redux devtools
    ],
    providers: [],
    bootstrap: [AppComponent]
})


export class AppModule { }