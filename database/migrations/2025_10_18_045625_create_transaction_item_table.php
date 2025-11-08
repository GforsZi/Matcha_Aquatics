<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transaction_item', function (Blueprint $table) {
            $table->bigIncrements('trxi_id');
            $table->unsignedBigInteger('trxi_product_id')->unsigned()->nullable();
            $table->unsignedBigInteger('trxi_transaction_id')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->string('trxi_sys_note')->nullable();
            $table->renameColumn('created_at', 'trxi_created_at');
            $table->renameColumn('updated_at', 'trxi_updated_at');
            $table->renameColumn('deleted_at', 'trxi_deleted_at');

            $table->foreign('trxi_product_id')->references('prd_id')->on('products')->onDelete('cascade');
            $table->foreign('trxi_transaction_id')->references('trx_id')->on('transactions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_item');
    }
};
