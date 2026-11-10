import http.server
import socketserver
import socket
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def find_free_port(start_port=9090):
    for port in range(start_port, start_port + 50):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return port
    return 9090

PORT = find_free_port(9090)

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

if __name__ == '__main__':
    local_ip = get_local_ip()
    print("=" * 60)
    print(" [BURGER PANIC MOBILE - SERVIDOR LOCAL]")
    print("=" * 60)
    print(f" * Para jugar en tu PC / Navegador:")
    print(f"   http://localhost:{PORT}")
    print(f"\n * Para jugar en tu CELULAR (Android / iOS):")
    print(f"   Conecta tu celular a la misma red Wi-Fi y abre:")
    print(f"   http://{local_ip}:{PORT}")
    print("=" * 60)
    print("Servidor activo. Presiona Ctrl + C para detener.\n")

    with ReusableTCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido.")
            sys.exit(0)
