import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class BackendApiService {
  private http = inject(HttpClient);

  login(payload: { email: string; password: string }) {
    return this.http.post<{ accessToken: string; role: 'ADMIN' | 'COORDINATRICE' | 'DOCTOR'; nom: string; prenom: string }>(
      `${API_BASE_URL}/auth/login`,
      payload,
    );
  }

  employees() {
    return this.http.get<any>(`${API_BASE_URL}/employees`);
  }

  createEmployee(payload: any) {
    return this.http.post<any>(`${API_BASE_URL}/employees`, payload);
  }

  archiveEmployee(id: string | number) {
    return this.http.patch<any>(`${API_BASE_URL}/employees/${id}/archive`, {});
  }

  employeeById(id: string | number) {
    return this.http.get<any>(`${API_BASE_URL}/employees/${id}`);
  }

  drugs(query = '') {
    return this.http.get<any>(`${API_BASE_URL}/drugs`, { params: { query } });
  }

  consultations(employeeId: string | number) {
    return this.http.get<any>(`${API_BASE_URL}/consultations`, { params: { employeeId } });
  }

  createConsultation(payload: any) {
    return this.http.post<any>(`${API_BASE_URL}/consultations`, payload);
  }

  consultationDocuments(consultationId: string | number) {
    return this.http.get<any>(`${API_BASE_URL}/documents`, { params: { consultationId } });
  }

  uploadDocument(file: File, employeeId: string | number, consultationId?: string | number) {
    const form = new FormData();
    form.append('file', file);
    form.append('employeeId', String(employeeId));
    if (consultationId != null) form.append('consultationId', String(consultationId));
    return this.http.post<any>(`${API_BASE_URL}/documents/upload`, form);
  }

  downloadDocument(id: string | number) {
    return this.http.get(`${API_BASE_URL}/documents/${id}/download`, { responseType: 'blob' });
  }

  deleteDocument(id: string | number) {
    return this.http.delete<void>(`${API_BASE_URL}/documents/${id}`);
  }

  appointments(from: string, to: string) {
    return this.http.get<any>(`${API_BASE_URL}/appointments`, { params: { from, to } });
  }

  createAppointment(payload: any) {
    return this.http.post<any>(`${API_BASE_URL}/appointments`, payload);
  }

  cancelAppointment(id: string | number) {
    return this.http.delete<any>(`${API_BASE_URL}/appointments/${id}`);
  }

  reminders(from: string, to: string) {
    return this.http.get<any>(`${API_BASE_URL}/reminders`, { params: { from, to } });
  }

  createManualReminder(payload: any) {
    return this.http.post<any>(`${API_BASE_URL}/reminders/manual`, payload);
  }

  sendReminder(id: string | number) {
    return this.http.put<any>(`${API_BASE_URL}/reminders/${id}/send`, {});
  }

  notifications() {
    return this.http.get<any>(`${API_BASE_URL}/notifications`);
  }

  adminUsers() {
    return this.http.get<any>(`${API_BASE_URL}/admin/users`);
  }

  createAdminUser(payload: any) {
    return this.http.post<any>(`${API_BASE_URL}/admin/users`, payload);
  }

  updateAdminUser(id: string | number, payload: any) {
    return this.http.put<any>(`${API_BASE_URL}/admin/users/${id}`, payload);
  }

  disableAdminUser(id: string | number) {
    return this.http.delete<any>(`${API_BASE_URL}/admin/users/${id}`);
  }

  adminAuditLogs() {
    return this.http.get<any>(`${API_BASE_URL}/admin/audit-logs`);
  }

  importDrugsCsv(file: File, clearBefore = false) {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<any>(`${API_BASE_URL}/admin/drugs/import`, form, {
      params: { clearBefore },
    });
  }

  generateReport(payload: any) {
    return this.http.post<any>(`${API_BASE_URL}/reports/generate`, payload);
  }

  downloadReport(id: string) {
    return this.http.get(`${API_BASE_URL}/reports/${id}/download`, { responseType: 'blob' });
  }

  aiRecommend(payload: { employeeId: number; symptoms: string }) {
    return this.http.post<any>(`${API_BASE_URL}/ai/recommend`, payload);
  }
}
