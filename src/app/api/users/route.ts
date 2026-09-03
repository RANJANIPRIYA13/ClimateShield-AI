import { NextRequest } from 'next/server';
import { successResponse, errorResponse, corsHeaders } from '@/lib/apiResponse';
import { validateRequiredFields, validateEmail, validateEnum } from '@/lib/validation';
import { dbStore } from '@/lib/db/store';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  const users = dbStore.getUsers();
  return successResponse(users, 'Users fetched successfully', 200, { count: users.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const missingErr = validateRequiredFields(body, ['name', 'email', 'role']);
    if (missingErr) return errorResponse(missingErr, 400);

    if (!validateEmail(body.email)) {
      return errorResponse(`Invalid email format: '${body.email}'`, 400);
    }

    const roleErr = validateEnum(body.role, ['Citizen', 'Authority', 'Responder', 'Admin'], 'role');
    if (roleErr) return errorResponse(roleErr, 400);

    const newUser = dbStore.createUser({
      name: body.name,
      email: body.email,
      role: body.role,
      phone: body.phone,
      zoneId: body.zoneId
    });

    return successResponse(newUser, 'User registered successfully', 201);
  } catch (err: any) {
    return errorResponse(`Failed to process user registration: ${err.message}`, 500);
  }
}
