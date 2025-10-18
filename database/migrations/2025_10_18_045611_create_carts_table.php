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
        Schema::create('carts', function (Blueprint $table) {
            $table->bigIncrements('crt_id');
            $table->unsignedBigInteger('crt_user_id')->unsigned();
            $table->unsignedBigInteger('crt_product_id')->unsigned();
            $table->timestamps();
            $table->unsignedBigInteger('crt_created_by')->unsigned()->nullable();
            $table->unsignedBigInteger('crt_deleted_by')->unsigned()->nullable();
            $table->unsignedBigInteger('crt_updated_by')->unsigned()->nullable();
            $table->softDeletes();
            $table->string('crt_sys_note')->nullable();

            $table->foreign('crt_user_id')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('crt_product_id')->references('prd_id')->on('products')->onDelete('cascade');

            $table->foreign('crt_created_by')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('crt_updated_by')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('crt_deleted_by')->references('usr_id')->on('users')->onDelete('cascade');

            $table->renameColumn('created_at', 'crt_created_at');
            $table->renameColumn('updated_at', 'crt_updated_at');
            $table->renameColumn('deleted_at', 'crt_deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
