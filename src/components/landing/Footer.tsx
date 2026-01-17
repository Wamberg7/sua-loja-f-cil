import { Zap, MessageSquare, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  produto: [
    { label: "Recursos", href: "#recursos" },
    { label: "Preços", href: "#" },
    { label: "Integrações", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  suporte: [
    { label: "Central de ajuda", href: "#" },
    { label: "Discord", href: "#" },
    { label: "Contato", href: "#" },
    { label: "Status", href: "#" },
  ],
  legal: [
    { label: "Termos de uso", href: "#" },
    { label: "Privacidade", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="py-16 border-t border-border bg-card/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">StoreLab</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              A plataforma mais simples para criar sua loja digital e vender produtos online.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-3">
              {footerLinks.produto.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-3">
              {footerLinks.suporte.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 StoreLab. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Feito com 💜 para vendedores digitais
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
