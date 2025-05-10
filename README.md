# FXAP Deobfuscator

FXAP Deobfuscator is a tool designed for decrypting and deobfuscating server-side `.fxap` scripts protected by FiveM's Keymaster. This tool is intended for **educational and research purposes only**.

> ⚠️ Currently, this tool **only supports server-side decryption**.

## Features

- Decrypt `.fxap` files protected by Keymaster
- Easy-to-use setup via a simple `start.bat` script
- Discord bot integration for remote decryption

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Barni5/fxap-deobfuscator.git
   ```
   or download the ZIP archive from GitHub and extract it.

2. Run `start.bat`:
   - If Java is not installed, the script will open a download page. Install Java and re-run `start.bat`.
   - Fill in the required values in the `config.json` file.

That's it! Once configured, the tool is ready to use.

## 💬 Discord Bot Usage

1. Send a message in the following format:
   ```
   /cfx cfxlicensekey_3224242
   ```

2. In a **separate message**, attach the `.fxap` and `.lua` files you wish to decrypt.

## ✅ Requirements

- Java (automatically prompted on first run if not installed)
- Internet connection for the Discord bot and a cfx license key that owns the resource you want to decrypt
- windows server


## 🧠 Tips

- Only one `.fxap` file and its matching `.lua` should be sent per decryption request.

---

Feel free to open an issue or submit a pull request if you run into any problems or want to suggest improvements.
