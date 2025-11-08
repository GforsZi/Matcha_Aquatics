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
        Schema::create('product_category', function (Blueprint $table) {
            $table->bigIncrements('prd_cat_id');
            $table->unsignedBigInteger('prd_cat_product_id')->unsigned();
            $table->unsignedBigInteger('prd_cat_category_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->string('prd_cat_sys_note')->nullable();
            $table->renameColumn('created_at', 'prd_cat_created_at');
            $table->renameColumn('updated_at', 'prd_cat_updated_at');
            $table->renameColumn('deleted_at', 'prd_cat_deleted_at');

            $table->foreign('prd_cat_product_id')->references('prd_id')->on('products')->onDelete('cascade');
            $table->foreign('prd_cat_category_id')->references('cat_id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_category');
    }
};
