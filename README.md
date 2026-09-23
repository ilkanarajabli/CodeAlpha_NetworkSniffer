# CodeAlpha - Basic Network Sniffer

This project was developed as part of the CodeAlpha Cyber Security Internship Program (Task 1).

## About the Project

This program uses Python and the `scapy` library to capture and analyze live network traffic. The sniffer monitors packets flowing through the network interface and extracts the following information:

- Source and destination IP addresses
- Protocol type (TCP, UDP, ICMP)
- Source and destination port numbers
- Readable payload content (when available)

## Technologies Used

- Python 3
- Scapy
- Npcap (packet capture driver for Windows)

## How to Run

1. Install the scapy library : pip install scapy
2. Windows users must also install [Npcap](https://npcap.com).
3. Run the script with administrator/root privileges : python network_sniffer.py
4. Press `Ctrl+C` to stop capturing.

## Disclaimer

This tool was built for educational purposes only. Capturing network traffic without authorization is illegal. Only run this program on your own network or in an environment where you have explicit permission.

## Author

Developed as part of the CodeAlpha Cyber Security Internship.
