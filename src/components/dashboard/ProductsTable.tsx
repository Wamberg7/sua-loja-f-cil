import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const products = [
  {
    id: 1,
    name: "Premium VIP",
    price: "R$ 49,90",
    stock: 150,
    sales: 87,
    status: "active",
  },
  {
    id: 2,
    name: "Key Especial",
    price: "R$ 19,90",
    stock: 500,
    sales: 234,
    status: "active",
  },
  {
    id: 3,
    name: "Pack Ultimate",
    price: "R$ 99,90",
    stock: 25,
    sales: 45,
    status: "active",
  },
  {
    id: 4,
    name: "Starter Kit",
    price: "R$ 9,90",
    stock: 0,
    sales: 156,
    status: "out_of_stock",
  },
  {
    id: 5,
    name: "Pro Bundle",
    price: "R$ 149,90",
    stock: 50,
    sales: 12,
    status: "draft",
  },
];

const statusConfig = {
  active: { label: "Ativo", className: "bg-success/20 text-success border-success/30" },
  out_of_stock: { label: "Sem estoque", className: "bg-destructive/20 text-destructive border-destructive/30" },
  draft: { label: "Rascunho", className: "bg-muted text-muted-foreground border-border" },
};

export function ProductsTable() {
  return (
    <div className="p-6 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-semibold text-lg">Produtos</h3>
          <p className="text-sm text-muted-foreground">Gerencie seu catálogo</p>
        </div>
        <Button variant="outline" size="sm">
          Ver todos
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Produto
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Preço
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Estoque
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Vendas
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-secondary/30 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold">{product.price}</td>
                <td className="py-4 px-4">
                  <span
                    className={
                      product.stock === 0
                        ? "text-destructive"
                        : product.stock < 30
                        ? "text-yellow-500"
                        : "text-foreground"
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="py-4 px-4 text-muted-foreground">{product.sales}</td>
                <td className="py-4 px-4">
                  <Badge
                    variant="outline"
                    className={statusConfig[product.status as keyof typeof statusConfig].className}
                  >
                    {statusConfig[product.status as keyof typeof statusConfig].label}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="w-4 h-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="w-4 h-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
