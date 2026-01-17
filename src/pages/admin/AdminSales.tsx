import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
import { Search, Eye, ShoppingCart, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { useAllSales, SaleWithDetails } from "@/hooks/useSales";

export default function AdminSales() {
  const { sales, isLoading, calculateFee, stats } = useAllSales();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSale, setSelectedSale] = useState<SaleWithDetails | null>(null);

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.store?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-500/10 text-emerald-500">Aprovado</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-500">Pendente</Badge>;
      case "refunded":
        return <Badge className="bg-red-500/10 text-red-500">Reembolsado</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/10 text-red-500">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const statsCards = [
    { title: "Vendas Hoje", value: formatCurrency(stats.totalToday), icon: ShoppingCart },
    { title: "Taxa Arrecadada", value: formatCurrency(stats.feesToday), icon: DollarSign },
    { title: "Ticket Médio", value: formatCurrency(stats.avgTicket), icon: TrendingUp },
  ];

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
          {statsCards.map((stat) => (
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
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredSales.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma venda encontrada
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Loja</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor Bruto</TableHead>
                    <TableHead>Taxa</TableHead>
                    <TableHead>Valor Líquido</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => {
                    const fee = calculateFee(sale.total);
                    const netValue = sale.total - fee;

                    return (
                      <TableRow key={sale.id}>
                        <TableCell className="font-mono font-medium">
                          #{sale.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>{sale.store?.name || "—"}</TableCell>
                        <TableCell>
                          <div>
                            <p>{sale.customer_name || "—"}</p>
                            <p className="text-sm text-muted-foreground">{sale.customer_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(sale.total)}</TableCell>
                        <TableCell className="text-primary">{formatCurrency(fee)}</TableCell>
                        <TableCell>{formatCurrency(netValue)}</TableCell>
                        <TableCell>{getStatusBadge(sale.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(sale.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </TableCell>
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
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Sale Details Dialog */}
        <Dialog open={!!selectedSale} onOpenChange={() => setSelectedSale(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Venda #{selectedSale?.id.slice(0, 8)}</DialogTitle>
            </DialogHeader>
            {selectedSale && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Loja</p>
                    <p className="font-medium">{selectedSale.store?.name || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">
                      {format(new Date(selectedSale.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium">{selectedSale.customer_name || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedSale.customer_email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Método de Pagamento</p>
                    <p className="font-medium">{selectedSale.payment_method || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(selectedSale.status)}
                  </div>
                </div>

                {/* Items */}
                {selectedSale.items && selectedSale.items.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold mb-3">Itens do Pedido</h4>
                    <div className="space-y-2">
                      {selectedSale.items.map((item) => (
                        <div key={item.id} className="flex justify-between p-2 bg-muted/50 rounded">
                          <span>{item.product_name} x{item.quantity}</span>
                          <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold mb-4">Financeiro</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">Valor Bruto</p>
                      <p className="text-xl font-bold">{formatCurrency(selectedSale.total)}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/10">
                      <p className="text-sm text-muted-foreground">Taxa Plataforma</p>
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(calculateFee(selectedSale.total))}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-emerald-500/10">
                      <p className="text-sm text-muted-foreground">Valor Líquido</p>
                      <p className="text-xl font-bold text-emerald-500">
                        {formatCurrency(selectedSale.total - calculateFee(selectedSale.total))}
                      </p>
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
