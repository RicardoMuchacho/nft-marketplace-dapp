// app/api/alchemy-webhook/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface EventData {
  type: string;
  webhookId: string;
  createdAt: string;
  block: any;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received webhook:", body);

    // Ensure the payload has the expected structure
    const logs = body.event?.data?.block?.logs;
    if (!logs || logs.length === 0) {
      return NextResponse.json({ message: "No logs found in event data" }, { status: 400 });
    }

    // Determine event type based on dummy logic with the topics
    const topics = logs[0].topics;
    const lastTopic = topics[topics.length - 1];
    let eventType: string;

    if (lastTopic === "0x0000000000000000000000000000000000000000000000000000000000000001") {
      eventType = "listing";
    } else if (lastTopic === "0x0000000000000000000000000000000000000000000000000000000000000002") {
      eventType = "unlisting";
    } else if (lastTopic === "0x0000000000000000000000000000000000000000000000000000000000000003") {
      eventType = "buy";
    } else {
      eventType = "unknown";
    }

    console.log("Determined event type:", eventType);

    // Only update the JSON file for specific event types
    if (["listing", "unlisting", "buy"].includes(eventType)) {
      // Define the file path to store events
      const dataFilePath = path.join(process.cwd(), 'data', 'events.json');

      // Read the existing file content or initialize an empty object if it doesn't exist
      let fileContent = "{}";
      try {
        fileContent = await fs.readFile(dataFilePath, 'utf-8');
      } catch (readError) {
        console.warn("No existing events file found, creating a new one.");
      }

      let jsonData: Record<string, EventData> = {};
      try {
        jsonData = JSON.parse(fileContent);
      } catch (parseError) {
        console.warn("Could not parse JSON file, starting with an empty object.");
      }

      // Update the JSON data with the new event using the webhook event id as the key
      jsonData[body.id] = {
        type: eventType,
        webhookId: body.webhookId,
        createdAt: body.createdAt,
        block: body.event.data.block,
      };

      // Write the updated JSON back to the file
      await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), 'utf-8');
      console.log("Updated events file with new event.");
    } else {
      console.log("Event type not processed:", eventType);
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { message: "Server error", error: error.toString() },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
    try {
      // Define the path to the JSON file
      const dataFilePath = path.join(process.cwd(), 'data', 'events.json');
  
      // Read file content (if the file doesn't exist, default to an empty object)
      let fileContent = "{}";
      try {
        fileContent = await fs.readFile(dataFilePath, 'utf-8');
      } catch (readError) {
        console.warn("Events file not found, returning empty object.");
      }
  
      let jsonData = {};
      try {
        jsonData = JSON.parse(fileContent);
      } catch (parseError) {
        console.warn("Could not parse JSON file, returning empty object.");
      }
  
      // Return the parsed JSON data
      return NextResponse.json(jsonData);
    } catch (error: any) {
      console.error("Error reading events file:", error);
      return NextResponse.json(
        { message: "Server error", error: error.toString() },
        { status: 500 }
      );
    }
  }