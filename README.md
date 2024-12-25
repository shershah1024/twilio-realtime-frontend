# OpenAI Realtime Twilio Demo

A demo application showcasing real-time phone calls using OpenAI's Assistants API and Twilio.

## Setup Instructions

1. Clone this repository
```bash
git clone <your-repo-url>
cd openai-realtime-twilio-demo/webapp
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file with your Twilio credentials:
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- Real-time phone calls with AI assistant
- Voice selection (ash, ballad, coral, sage, verse)
- Customizable assistant instructions
- Tool configuration for enhanced capabilities
- Live call transcript
- Function call monitoring

## Environment Variables

- `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
- `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token

## Backend Configuration

The application connects to a WebSocket backend at `wss://llm-call-1.vercel.app` for handling real-time communication.

## License

MIT 