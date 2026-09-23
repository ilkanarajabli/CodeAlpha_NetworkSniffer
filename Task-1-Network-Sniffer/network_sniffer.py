from scapy.all import sniff, IP, TCP, UDP, ICMP, Raw
from datetime import datetime

packet_count = 0

def process_packet(packet):
    global packet_count
    packet_count += 1

    print("=" * 50)
    print("Paket #", packet_count, " Vaxt:", datetime.now().strftime("%H:%M:%S"))
    print("=" * 50)

    if packet.haslayer(IP):
        src_ip = packet[IP].src
        dst_ip = packet[IP].dst
        print("Menbe IP:", src_ip)
        print("Teyinat IP:", dst_ip)
        print("TTL:", packet[IP].ttl)

        if packet.haslayer(TCP):
            print("Protokol: TCP")
            print("Menbe Port:", packet[TCP].sport)
            print("Teyinat Port:", packet[TCP].dport)
            print("Flags:", packet[TCP].flags)

        elif packet.haslayer(UDP):
            print("Protokol: UDP")
            print("Menbe Port:", packet[UDP].sport)
            print("Teyinat Port:", packet[UDP].dport)

        elif packet.haslayer(ICMP):
            print("Protokol: ICMP")
            print("Type:", packet[ICMP].type)
            print("Code:", packet[ICMP].code)

        else:
            print("Protokol: Diger")

        if packet.haslayer(Raw):
            data = packet[Raw].load
            text = ""
            for b in data[:100]:
                if 32 <= b <= 126:
                    text += chr(b)
                else:
                    text += "."
            print("Payload:", text)
    else:
        print("Bu paketde IP qati yoxdur")

    print()


print("Basic Network Sniffer basladi")
print("Dayandirmaq ucun Ctrl+C basin")
print()

try:
    sniff(prn=process_packet, store=False, count=0)
except KeyboardInterrupt:
    print("Sniffer dayandirildi. Umumi paket sayi:", packet_count)
except PermissionError:
    print("Xeta: Bu proqrami admin/root olaraq calisdirmalisiniz")
