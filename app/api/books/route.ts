import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

export async function GET() {
  try {
    if (!DATABASE_ID) {
      throw new Error('Notion Database ID not found');
    }

    console.log('Fetching from database:', DATABASE_ID); // Debug log

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [
        {
          property: 'Title',
          direction: 'ascending',
        },
      ],
    });

    console.log('Notion API Response:', JSON.stringify(response, null, 2)); // Debug log

    if (!response.results.length) {
      console.log('No results found in the database'); // Debug log
    }

    return NextResponse.json(response.results);
  } catch (error) {
    console.error('Detailed error:', error); // Debug log
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch books from Notion' },
      { status: 500 }
    );
  }
} 