-- Seed data: ~18 realistic Windows 11 tutorials
-- Run this after creating the guides table.

INSERT INTO guides (slug, title, description, category, os_type, tier_required, difficulty, estimated_minutes, is_published, content) VALUES

-- Performance (3)
('fix-slow-startup-windows-11', 'Fix slow startup in Windows 11', 'Your computer takes forever to start up. This guide walks you through disabling unnecessary startup programs and speeding things up.', 'Performance', 'windows11', 'free', 'beginner', 5, true,
'## Step 1: Open Task Manager
Press **Ctrl + Shift + Esc** to open Task Manager.

## Step 2: Go to Startup Apps
Click the **Startup apps** tab on the left side.

## Step 3: Disable unnecessary programs
Look for programs you do not need when your computer starts. Right-click each one and choose **Disable**.

## Step 4: Restart your computer
Restart and see if startup is faster. It should be noticeably quicker.'),

('free-up-disk-space-windows-11', 'Free up disk space with Disk Cleanup', 'Running low on storage? Use the built-in Disk Cleanup tool to remove temporary files and free up space.', 'Performance', 'windows11', 'free', 'beginner', 8, true,
'## Step 1: Open Settings
Click the Start menu and open **Settings** (gear icon).

## Step 2: Go to Storage
Click **System** then **Storage**.

## Step 3: Turn on Storage Sense
Toggle **Storage Sense** to On. This automatically cleans up files you no longer need.

## Step 4: Run cleanup now
Click **Run Storage Sense now** to immediately free up space.

## Step 5: Check Temporary Files
Click **Temporary files** to see what can be safely removed. Check the boxes and click **Remove files**.'),

('speed-up-slow-computer', 'Speed up a slow Windows 11 computer', 'Your computer feels sluggish. Learn how to check what is using your resources and fix common causes of slowness.', 'Performance', 'windows11', 'pro', 'intermediate', 12, true,
'## Step 1: Check what is using your resources
Press **Ctrl + Shift + Esc** to open Task Manager. Click the **Processes** tab and sort by CPU or Memory to find resource-heavy programs.

## Step 2: Close unnecessary programs
Right-click any program using a lot of resources that you do not need, and choose **End task**.

## Step 3: Disable visual effects
Open the Start menu and search for **Adjust the appearance and performance of Windows**. Choose **Adjust for best performance** or manually uncheck effects you do not need.

## Step 4: Check for malware
Open **Windows Security** from the Start menu. Run a **Quick scan** to check for threats.

## Step 5: Update Windows
Go to **Settings > Windows Update** and install any available updates. Outdated software can cause slowness.'),

-- Security (2)
('remove-suspicious-popups', 'Remove suspicious browser popups', 'Getting strange popups in your browser? This guide helps you identify and remove them safely.', 'Security', 'windows11', 'free', 'beginner', 7, true,
'## Step 1: Do not click the popup
If you see a suspicious popup, do **not** click anything inside it. Do not call any phone numbers it shows.

## Step 2: Close the tab or browser
Press **Ctrl + W** to close the tab. If that does not work, press **Alt + F4** to close the entire browser.

## Step 3: Clear your browser data
Open your browser settings and find **Clear browsing data**. Clear cookies, cached images, and site data.

## Step 4: Check browser extensions
Go to your browser''s extensions page. Remove any extensions you do not recognize.

## Step 5: Run Windows Security scan
Open **Windows Security** and run a **Full scan** to check for threats.'),

('recognize-phishing-emails', 'How to recognize phishing emails', 'Learn the signs of a fake email trying to steal your information. Stay safe with these simple checks.', 'Security', 'windows11', 'free', 'beginner', 5, true,
'## Step 1: Check the sender address
Look at the actual email address, not just the display name. Scammers often use addresses that look similar to real companies but have small differences.

## Step 2: Look for urgency
Phishing emails often say things like "Act now!" or "Your account will be closed!" Real companies rarely pressure you this way.

## Step 3: Do not click links
Hover over any link without clicking. Check if the web address looks legitimate. If it looks strange, do not click it.

## Step 4: Check for spelling errors
Many phishing emails have obvious spelling and grammar mistakes that real companies would not make.

## Step 5: When in doubt, go directly to the website
Instead of clicking a link in an email, open your browser and type the company''s website address yourself.'),

-- Printer (2)
('connect-printer-windows-11', 'Connect a printer to Windows 11', 'Step-by-step instructions for adding a new printer to your Windows 11 computer, whether it is USB or wireless.', 'Printer', 'windows11', 'free', 'beginner', 8, true,
'## Step 1: Turn on your printer
Make sure your printer is plugged in and turned on. If it is wireless, make sure it is connected to the same Wi-Fi network as your computer.

## Step 2: Open Settings
Click the Start menu and open **Settings**.

## Step 3: Go to Printers
Click **Bluetooth & devices** then **Printers & scanners**.

## Step 4: Add a printer
Click **Add device**. Windows will search for available printers.

## Step 5: Select your printer
When your printer appears in the list, click it and follow the on-screen instructions to finish setup.'),

('fix-printer-offline', 'Fix a printer showing as offline', 'Your printer says it is offline even though it is turned on. Here is how to get it working again.', 'Printer', 'windows11', 'pro', 'beginner', 6, true,
'## Step 1: Check the basics
Make sure your printer is turned on and connected (USB cable or Wi-Fi).

## Step 2: Restart the printer
Turn the printer off, wait 30 seconds, then turn it back on.

## Step 3: Set as default printer
Go to **Settings > Bluetooth & devices > Printers & scanners**. Click your printer and choose **Set as default**.

## Step 4: Run the troubleshooter
On the same page, click **Troubleshoot**. Windows will try to fix the problem automatically.'),

-- Internet (2)
('fix-wifi-not-connecting', 'Fix Wi-Fi not connecting in Windows 11', 'Your computer will not connect to Wi-Fi. Follow these steps to diagnose and fix the most common causes.', 'Internet', 'windows11', 'free', 'beginner', 7, true,
'## Step 1: Check if Wi-Fi is turned on
Click the network icon in the taskbar (bottom right). Make sure Wi-Fi is toggled on.

## Step 2: Forget and reconnect
Click your Wi-Fi network, then click **Forget**. Now click it again and enter your password to reconnect.

## Step 3: Restart your router
Unplug your router, wait 30 seconds, then plug it back in. Wait 2 minutes for it to fully restart.

## Step 4: Run the network troubleshooter
Go to **Settings > System > Troubleshoot > Other troubleshooters**. Run the **Network and Internet** troubleshooter.

## Step 5: Update your network driver
Open **Device Manager**, expand **Network adapters**, right-click your Wi-Fi adapter, and choose **Update driver**.'),

('improve-slow-internet', 'Improve slow internet speeds', 'Your internet connection feels slow. Learn how to check your speed and improve your connection.', 'Internet', 'windows11', 'pro', 'intermediate', 10, true,
'## Step 1: Test your speed
Open your browser and go to **speedtest.net**. Click **Go** to check your current download and upload speeds.

## Step 2: Move closer to your router
Wi-Fi signals weaken with distance and walls. Try moving closer to your router or removing obstacles between you and the router.

## Step 3: Disconnect other devices
If many devices are using your Wi-Fi at the same time, your speed will be slower. Disconnect devices you are not using.

## Step 4: Change your DNS
Go to **Settings > Network & internet > Wi-Fi > your network > DNS server assignment**. Click **Edit** and change to Google DNS: **8.8.8.8** and **8.8.4.4**.

## Step 5: Restart your router
Unplug your router for 30 seconds, then plug it back in. This often fixes temporary slowdowns.'),

-- Email (2)
('set-up-email-windows-mail', 'Set up email in the Windows Mail app', 'Learn how to add your email account to the built-in Mail app so you can send and receive emails.', 'Email', 'windows11', 'free', 'beginner', 5, true,
'## Step 1: Open the Mail app
Click the Start menu and search for **Mail**. Open the Mail app.

## Step 2: Add an account
Click **Add account** or go to **Settings > Manage accounts > Add account**.

## Step 3: Choose your email provider
Select your email provider (Google, Outlook, Yahoo, etc.) from the list.

## Step 4: Sign in
Enter your email address and password. Follow the prompts to allow access.

## Step 5: Done
Your email will sync automatically. You should see your inbox within a few minutes.'),

('reset-forgotten-microsoft-password', 'Reset a forgotten Microsoft account password', 'Locked out of your Microsoft account? Here is how to reset your password and get back in.', 'Email', 'windows11', 'free', 'beginner', 5, true,
'## Step 1: Go to the reset page
Open your browser and go to **account.live.com/password/reset**.

## Step 2: Enter your email
Type the email address for your Microsoft account and click **Next**.

## Step 3: Verify your identity
Choose how you want to receive a security code (email or phone). Enter the code when you receive it.

## Step 4: Create a new password
Type a new password. Make it at least 8 characters with a mix of letters and numbers.

## Step 5: Sign in with your new password
Go back to the sign-in page and use your new password.'),

-- Storage (1)
('manage-onedrive-storage', 'Manage OneDrive storage on Windows 11', 'OneDrive is filling up your hard drive. Learn how to control what syncs and free up local space.', 'Storage', 'windows11', 'pro', 'intermediate', 8, true,
'## Step 1: Open OneDrive settings
Click the OneDrive cloud icon in your taskbar (bottom right). Click the gear icon and choose **Settings**.

## Step 2: Choose what to sync
Go to the **Sync and backup** tab. Click **Manage backup** and uncheck folders you do not need synced locally.

## Step 3: Use Files On-Demand
In OneDrive Settings, make sure **Files On-Demand** is turned on. This keeps files in the cloud until you need them.

## Step 4: Free up space
In File Explorer, right-click any OneDrive file or folder you do not need offline. Choose **Free up space**. The file stays in the cloud but no longer takes up hard drive space.'),

-- Bluetooth (2)
('connect-bluetooth-speaker', 'Connect a Bluetooth speaker to Windows 11', 'Want to play music through a Bluetooth speaker? Here is how to pair it with your computer.', 'Bluetooth', 'windows11', 'free', 'beginner', 4, true,
'## Step 1: Turn on your speaker
Put your Bluetooth speaker in pairing mode. This is usually done by pressing and holding the Bluetooth or power button until a light flashes.

## Step 2: Open Bluetooth settings
Go to **Settings > Bluetooth & devices**. Make sure Bluetooth is toggled **On**.

## Step 3: Add a device
Click **Add device** then choose **Bluetooth**.

## Step 4: Select your speaker
Your speaker should appear in the list. Click it to pair.

## Step 5: Test the audio
Play some music or a video to make sure sound comes through the speaker.'),

('fix-bluetooth-not-working', 'Fix Bluetooth not working in Windows 11', 'Bluetooth stopped working or is not showing devices. Follow these steps to get it working again.', 'Bluetooth', 'windows11', 'pro', 'intermediate', 8, true,
'## Step 1: Check if Bluetooth is on
Go to **Settings > Bluetooth & devices**. Toggle Bluetooth off, wait 5 seconds, then toggle it back on.

## Step 2: Run the Bluetooth troubleshooter
Go to **Settings > System > Troubleshoot > Other troubleshooters**. Find **Bluetooth** and click **Run**.

## Step 3: Restart the Bluetooth service
Press **Win + R**, type **services.msc**, and press Enter. Find **Bluetooth Support Service**, right-click it, and choose **Restart**.

## Step 4: Update the Bluetooth driver
Open **Device Manager**, expand **Bluetooth**, right-click your Bluetooth adapter, and choose **Update driver**.

## Step 5: Remove and re-pair devices
Go to **Settings > Bluetooth & devices**. Click the three dots next to the problem device and choose **Remove device**. Then pair it again.'),

-- Apps (1)
('uninstall-programs-windows-11', 'Uninstall programs you do not need', 'Remove programs that are taking up space or that you no longer use. This guide shows you how.', 'Apps', 'windows11', 'free', 'beginner', 4, true,
'## Step 1: Open Settings
Click the Start menu and open **Settings**.

## Step 2: Go to Installed apps
Click **Apps** then **Installed apps**.

## Step 3: Find the program
Scroll through the list or use the search bar to find the program you want to remove.

## Step 4: Uninstall it
Click the three dots next to the program and choose **Uninstall**. Follow any prompts to complete the removal.'),

-- Browser (1)
('clear-browser-cache-cookies', 'Clear your browser cache and cookies', 'Websites loading slowly or showing old content? Clearing your cache and cookies usually fixes it.', 'Browser', 'windows11', 'free', 'beginner', 3, true,
'## Step 1: Open your browser settings
In Chrome: click the three dots (top right) then **Settings**.
In Edge: click the three dots then **Settings**.

## Step 2: Find privacy settings
In Chrome: click **Privacy and security** then **Clear browsing data**.
In Edge: click **Privacy, search, and services** then **Choose what to clear**.

## Step 3: Select what to clear
Check **Cookies and other site data** and **Cached images and files**. Set the time range to **All time**.

## Step 4: Clear the data
Click the **Clear data** button. Your browser will remove the stored files.

## Step 5: Reload the page
Go back to the website that was causing problems and refresh the page.'),

-- Settings (2)
('change-default-browser', 'Change your default browser in Windows 11', 'Windows keeps opening links in Edge but you want to use Chrome or Firefox? Here is how to change it.', 'Settings', 'windows11', 'free', 'beginner', 3, true,
'## Step 1: Open Settings
Click the Start menu and open **Settings**.

## Step 2: Go to Default apps
Click **Apps** then **Default apps**.

## Step 3: Find your browser
Scroll down or search for the browser you want to use (Chrome, Firefox, etc.).

## Step 4: Set it as default
Click on your browser, then click **Set default** at the top of the page.

## Step 5: Done
Links and web files will now open in your chosen browser.'),

('customize-taskbar-windows-11', 'Customize your Windows 11 taskbar', 'Move the Start button, hide icons, and make the taskbar work the way you want.', 'Settings', 'windows11', 'pro', 'beginner', 5, true,
'## Step 1: Open Taskbar settings
Right-click on an empty area of the taskbar and choose **Taskbar settings**.

## Step 2: Move the Start button
Under **Taskbar behaviors**, change **Taskbar alignment** from **Center** to **Left** if you prefer the classic layout.

## Step 3: Hide or show system icons
Under **Taskbar items**, toggle on or off the items you want to see (Search, Task View, Widgets, Chat).

## Step 4: Auto-hide the taskbar
Under **Taskbar behaviors**, check **Automatically hide the taskbar** if you want more screen space. The taskbar will appear when you move your mouse to the bottom of the screen.');
