import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  count?: number;
  timestamp: string;
}

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export function successResponse<T>(
  data: T,
  message = 'Operation successful',
  status = 200,
  extra?: Record<string, any>
) {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    ...(extra || {}),
  };

  return NextResponse.json(payload, {
    status,
    headers: corsHeaders(),
  });
}

export function errorResponse(
  error: string,
  status = 400,
  details?: any
) {
  const payload: ApiResponse = {
    success: false,
    error,
    ...(details ? { details } : {}),
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(payload, {
    status,
    headers: corsHeaders(),
  });
}
