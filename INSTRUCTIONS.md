# Instructions

## Setup Instructions

1. Open the project in your IDE (VSCode recommended)
2. Install dependencies:
   ```bash
   npm install
   ```
3. The postinstall script will run automatically to set up the application

## Configuration

### Main Settings

Open `src/settings/settings.js` and configure according to your needs:

#### General Settings
- `MODE`: Application mode - `STANDARD` or `SILENT`
- `EMAIL_ADDRESSES`: Array of email addresses to subscribe to spam services
- `PUBLIC_IP_ADDRESS_URL`: URL to check your public IP address (default: `https://api.ipify.org`)

#### Feature Flags
- `IS_PRODUCTION_ENVIRONMENT`: 
  - `true`: Real subscriptions to spam services
  - `false`: Development mode with simulated subscriptions
- `IS_PROXY_CONNECTION_ACTIVE`:
  - `true`: Connect via random proxy servers
  - `false`: Use local connection
- `IS_RANDOM_SUBSCRIBES_EXCEEDED`:
  - `true`: Take random subscribes when limit exceeded
  - `false`: Take subscribes in original order

#### Logging Configuration
- `IS_LOG_SUBSCRIBE_VALID`: Log successful subscriptions
- `IS_LOG_SUBSCRIBE_INVALID`: Log failed subscriptions

#### Limits and Counts
- `MAXIMUM_EMAIL_ADDRESSES_COUNT`: Maximum number of email addresses to process (default: 10)
- `MAXIMUM_SUBSCRIBES_COUNT`: Maximum subscribes per email address (default: 2000)
- `MILLISECONDS_TIMEOUT_EXIT_APPLICATION`: Delay before exiting (default: 1000ms)
- `MAXIMUM_VALIDATE_INTERNET_CONNECTION_RETRIES_COUNT`: Internet validation retries (default: 5)
- `MAXIMUM_PROXY_VALIDATIONS_RETRIES_COUNT`: Proxy validation retries (default: 10)

### Subscribe List Configuration

1. Create or modify the subscribe list JSON file at: `sources/subscribe-list.json`
2. Format each subscription entry as:
```json
{
  "urlAddress": "https://example.com/newsletter",
  "textBoxFieldName": "email",
  "textBoxFieldValue": "email",
  "buttonFieldName": "button",
  "buttonFieldValue": "Subscribe"
}
```

**Field descriptions:**
- `urlAddress`: URL of the newsletter subscription page
- `textBoxFieldName`: HTML name/id attribute of the email input field
- `textBoxFieldValue`: Value type to enter (usually "email")
- `buttonFieldName`: HTML name/id/type of the submit button
- `buttonFieldValue`: Button text or value

### Path Configuration

The application uses several path settings (auto-calculated at runtime):
- `APPLICATION_NAME`: Application identifier
- `OUTER_APPLICATION_PATH`: Root directory containing backups and sources
- `INNER_APPLICATION_PATH`: Main application source directory
- `SUBSCRIBE_LIST_FILE_PATH`: Path to the subscribe list JSON file

## Running Scripts

### Main Subscribe Script
Runs the subscription process:
```bash
npm start
```

**Prerequisites:**
- Internet connection
- Valid subscribe list JSON file
- Configured email addresses in settings

**Process flow:**
1. Validates settings and internet connection
2. Loads email addresses and subscribe list
3. Connects to proxy (if enabled)
4. Initiates subscription process
5. Logs results

### Backup Script
Creates a backup of the application:
```bash
npm run backup
```

**What it backs up:**
- All source files
- Configuration files
- Excludes: `.git`, `dist`, `node_modules`, `sources`

### Sandbox Testing
Runs the sandbox test file:
```bash
npm run sand
```

### Stop All Processes
Stops all Node.js processes (Windows only):
```bash
npm run stop
```

## Development vs Production

### Development Mode (`IS_PRODUCTION_ENVIRONMENT: false`)
- Simulates subscriptions with delays
- No actual HTTP requests to subscription services
- Logs all actions
- Safe for testing configurations

### Production Mode (`IS_PRODUCTION_ENVIRONMENT: true`)
- Real subscriptions to spam services
- Actual HTTP requests via Puppeteer
- Uses proxy connections (if enabled)
- ⚠️ Use responsibly and ethically

## Proxy Configuration

When `IS_PROXY_CONNECTION_ACTIVE` is `true`:
- Fetches random proxy servers from multiple sources
- Validates proxy connection and anonymity
- Supports SOCKS4 protocol
- Validates country codes
- Retries up to `MAXIMUM_PROXY_VALIDATIONS_RETRIES_COUNT` times

**Proxy validation checks:**
- IP address format
- Port validity
- Anonymity level
- Protocol support
- Country code
- Connection test

## Error Codes

All errors include unique codes for troubleshooting:
- `1000016`: No valid subscribes found to subscribe
- `1000017`: No subscribes exist after validation
- `1000018`: No CREATE status subscribes available
- `1000019`: File path not found
- `1000020`: Path is directory, not file
- `1000021`: File must be JSON format
- `1000022`: No data in JSON file

## File Structure

### Source Files (`sources/`)
- `subscribe-list.json` - Newsletter subscription URLs and field configurations

### Distribution Files (`dist/`)
Generated log files and results are placed in the dist directory.

### Backups (`backups/`)
Application backups are stored outside the main application directory.

## Configuration Files

### Ignore Lists
- `ignoreEmailAddressesList.configuration.js`: Email addresses to skip
- `ignoreSubscribeURLsList.configuration.js`: URLs to skip
- `countriesCodesList.configuration.js`: Valid country codes for proxies

## Status Tracking

The application tracks various statuses:

**Subscribe Statuses:**
- `CREATE`: Ready to subscribe
- `SUBSCRIBE`: Successfully subscribed
- `FAIL`: Subscription failed
- `NO_DATA`: No data provided
- `MISSING_URL`: URL field missing
- `INVALID_URL`: Invalid URL format
- `DUPLICATE`: Duplicate entry
- `IGNORE`: In ignore list

**Proxy Statuses:**
- `CREATE`: Proxy created
- `MISSING_IP_ADDRESS`: No IP provided
- `INVALID_IP_ADDRESS`: Invalid IP format
- `MISSING_PORT`: No port provided
- `INVALID_PORT`: Invalid port number
- `INVALID_ANONYMITY_LEVEL`: Unsupported anonymity
- `INVALID_PROTOCOLS`: Protocol not supported

## Best Practices

1. **Test in development mode first**: Always test with `IS_PRODUCTION_ENVIRONMENT: false`
2. **Use proxy connections**: Enable `IS_PROXY_CONNECTION_ACTIVE` for anonymity
3. **Validate subscribe list**: Ensure all URLs and selectors are correct
4. **Monitor logs**: Check dist folder for detailed logs
5. **Backup regularly**: Use the backup script before major changes
6. **Ethical usage**: Use this tool responsibly and legally

## Troubleshooting

### Common Issues

**No proxies found:**
- Check internet connection
- Increase `MAXIMUM_PROXY_VALIDATIONS_RETRIES_COUNT`
- Try different time of day (proxy availability varies)

**Subscriptions failing:**
- Verify URL selectors in subscribe list
- Check if websites changed their form structure
- Enable logging to debug specific failures

**Path errors:**
- Verify `SUBSCRIBE_LIST_FILE_PATH` points to valid JSON file
- Check file permissions
- Ensure directory structure is correct

## Notes

- The application requires an internet connection
- Proxy connections may be slower than direct connections
- Some subscription forms may use anti-bot protection
- Puppeteer runs in headless mode by default
- All calendar files use UTF-8 encoding

## Author

* **Or Assayag** - *Initial work* - [orassayag](https://github.com/orassayag)
* Or Assayag <orassayag@gmail.com>
* GitHub: https://github.com/orassayag
* StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
* LinkedIn: https://linkedin.com/in/orassayag
