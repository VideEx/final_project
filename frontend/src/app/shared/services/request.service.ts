import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {OrderType} from "../../../types/order.type";

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(private http: HttpClient) {
  }

  orderRequest(name: string, phone: string, type: string, service?: string): Observable<DefaultResponseType> {
    const body: OrderType = {
      name, phone, type
    }
    if (service) {
      body.service = service
    }
    return this.http.post<DefaultResponseType>(environment.api + 'requests', body);
  }
}
