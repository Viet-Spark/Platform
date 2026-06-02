import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { google } from 'googleapis';

function getSheetsClient() {
	const auth = new google.auth.GoogleAuth({
		credentials: {
			client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
			private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
		},
		scopes: ['https://www.googleapis.com/auth/spreadsheets']
	});

	return google.sheets({ version: 'v4', auth });
}

function normalizeEmail(email) {
	return email.trim().toLowerCase();
}

export async function POST({ request }) {
	try {
		const { name, email, company, titleRole, bayAreaStatus, contributions } = await request.json();

		if (
			!name?.trim() ||
			!email?.trim() ||
			!company?.trim() ||
			!titleRole?.trim() ||
			!bayAreaStatus?.trim() ||
			!Array.isArray(contributions) ||
			!contributions.length
		) {
			return json(
				{
					success: false,
					reason: 'missing_fields',
					message: 'Please complete all required fields before submitting.'
				},
				{ status: 400 }
			);
		}

		const normalizedEmail = normalizeEmail(email);
		const sheets = getSheetsClient();
		const spreadsheetId = env.GOOGLE_SHEETS_SPREADSHEET_ID;
		const sheetName = env.MENTOR_SHEET_NAME;

		const existingEmailsResponse = await sheets.spreadsheets.values.get({
			spreadsheetId,
			range: `${sheetName}!B2:B`
		});

		const existingEmails =
			existingEmailsResponse.data.values?.flat().map((value) => normalizeEmail(String(value))) ??
			[];

		if (existingEmails.includes(normalizedEmail)) {
			return json(
				{
					success: false,
					reason: 'duplicate_email',
					message: 'This email has already been submitted for mentor interest.'
				},
				{ status: 409 }
			);
		}

		await sheets.spreadsheets.values.append({
			spreadsheetId,
			range: `${sheetName}!A:F`,
			valueInputOption: 'USER_ENTERED',
			requestBody: {
				values: [[
					name.trim(),
					normalizedEmail,
					company.trim(),
					titleRole.trim(),
					bayAreaStatus.trim(),
					contributions.map((value) => String(value).trim()).join('; ')
				]]
			}
		});

		return json({
			success: true,
			message: "Thanks for your interest in mentoring. We'll be in touch soon."
		});
	} catch (error) {
		console.error('Mentor submit error:', error);

		return json(
			{
				success: false,
				reason: 'server_error',
				message: 'Something went wrong. Please try again later.'
			},
			{ status: 500 }
		);
	}
}
