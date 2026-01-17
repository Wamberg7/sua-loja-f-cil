import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

const sales = [
  {
    id: "#VND-001",
    store: "Loja Digital Pro",
    customer: "Carlos Mendes",
    email: "carlos@email.com",
    product: "Curso de Marketing",
    variation: "Completo",
    grossValue: "R$ 497,00",
    platformFee: "R$ 15,71",
    netValue: "R$ 481,29",
    status: "approved",
    paymentMethod: "Cartão",
    date: "15/01/2024 14:30",
  },
  {
    id: "#VND-002",
    store: "E-books Master",
    customer: "Lucia Ferreira",
    email: "lucia@email.com",
    product: "E-book Finanças",
    variation: "-",
    grossValue: "R$ 47,00",
    platformFee: "R$ 2,21",
    netValue: "R$ 44,79",
    status: "approved",
    paymentMethod: "Pix",
    date: "15/01/2024 12:15",
  },
  {
    id: "#VND-003",
    store: "Cursos Online",
    customer: "Roberto Lima",
    email: "roberto@email.com",
    product: "Template Premium",
    variation: "Licença Pro",
    grossValue: "R$ 197,00",
    platformFee: "R$ 6,71",
    netValue: "R$ 190,29",
    status: "pending",
    paymentMethod: "Pix",
    date: "14/01/2024 18:45",
  },
  {
    id: "#VND-004",
    store: "Templates Hub",
    customer: "Amanda Costa",
    email: "amanda@email.com",
    product: "Pack de Icons",
    variation: "-",
    grossValue: "R$ 29,00",
    platformFee: "R$ 1,67",
    netValue: "R$ 27,33",
    status: "approved",
    paymentMethod: "Cartão",
    date: "14/01/2024 10:20",
  },
  {
    id: "#VND-005",
    store: "Loja Digital Pro",
    customer: "Felipe Santos",
    email: "felipe@email.com",
    product: "Mentoria Individual",
    variation: "3 Meses",
    grossValue: "R$ 1.997,00",
    platformFee: "R$ 60,71",
    netValue: "R$ 1.936,29",
    status: "refunded",
    paymentMethod: "Cartão",
    date: "13/01/2024 09:00",
  },
];

const stats = [
  { title: "Vendas Hoje", value: "R$ 12.450", icon: ShoppingCart },
  { title: "Taxa Arrecadada", value: "R$ 456,78", icon: DollarSign },
  { title: "Ticket Médio", value: "R$ 287,00", icon: TrendingUp },
];

export default function AdminSales() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSale, setSelectedSale] = useState<typeof sales[0] | null>(null);

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-500/10 text-emerald-500">Aprovado</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-500">Pendente</Badge>;
      case "refunded":
        return <Badge className="bg-red-500/10 text-red-500">Reembolsado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendas</h1>
          <p className="text-muted-foreground mt-1">Todas as vendas da plataforma</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por ID, loja ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="refunded">Reembolsado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Histórico de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Loja</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Valor Bruto</TableHead>
                  <TableHead>Taxa</TableHead>
                  <TableHead>Valor Líquido</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.store}</TableCell>
                    <TableCell>
                      <div>
                        <p>{sale.customer}</p>
                        <p className="text-sm text-muted-foreground">{sale.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{sale.product}</p>
                        {sale.variation !== "-" && (
                          <p className="text-sm text-muted-foreground">{sale.variation}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{sale.grossValue}</TableCell>
                    <TableCell className="text-primary">{sale.platformFee}</TableCell>
                    <TableCell>{sale.netValue}</TableCell>
                    <TableCell>{getStatusBadge(sale.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedSale(sale)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sale Details Dialog */}
        <Dialog open={!!selectedSale} onOpenChange={() => setSelectedSale(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Venda {selectedSale?.id}</DialogTitle>
            </DialogHeader>
            {selectedSale && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Loja</p>
                    <p className="font-medium">{selectedSale.store}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">{selectedSale.date}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium">{selectedSale.customer}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedSale.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Produto</p>
                    <p className="font-medium">{selectedSale.product}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Variação</p>
                    <p className="font-medium">{selectedSale.variation}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Método de Pagamento</p>
                    <p className="font-medium">{selectedSale.paymentMethod}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(selectedSale.status)}
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold mb-4">Financeiro</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">Valor Bruto</p>
                      <p className="text-xl font-bold">{selectedSale.grossValue}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/10">
                      <p className="text-sm text-muted-foreground">Taxa Plataforma</p>
                      <p className="text-xl font-bold text-primary">{selectedSale.platformFee}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-emerald-500/10">
                      <p className="text-sm text-muted-foreground">Valor Líquido</p>
                      <p className="text-xl font-bold text-emerald-500">{selectedSale.netValue}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setSelectedSale(null)}>
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
