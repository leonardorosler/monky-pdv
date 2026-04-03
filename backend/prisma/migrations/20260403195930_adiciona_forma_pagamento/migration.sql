-- AlterTable
ALTER TABLE "Venda" ADD COLUMN     "desconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "formaPagamento" TEXT NOT NULL DEFAULT 'dinheiro';
