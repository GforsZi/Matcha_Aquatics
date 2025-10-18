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
        Schema::create('transactions', function (Blueprint $table) {
            $table->bigIncrements('trx_id');
            $table->string('trx_invoice')->unique();
            $table->unsignedBigInteger('trx_buyer_id')->unsigned();
            $table->unsignedBigInteger('trx_seller_id')->unsigned();
            $table->integer('trx_total');
            $table->integer('trx_subtotal');
            $table->integer('trx_discount')->default(0);
            $table->integer('trx_shipping_cost')->default(0);
            $table->string('trx_payment_method');
            $table->enum('trx_payment_status', ['1','2','3','4'])->default('1');
            $table->enum('trx_status', ['1','2','3','4','5','6','7'])->default('1');
            $table->string('trx_shipping_service')->nullable();
            $table->string('trx_shipping_courier')->nullable();
            $table->string('trx_tracking_code')->nullable();
            $table->string('trx_qr_reference')->nullable();
            $table->text('trx_notes')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('trx_created_by')->unsigned()->nullable();
            $table->unsignedBigInteger('trx_deleted_by')->unsigned()->nullable();
            $table->unsignedBigInteger('trx_updated_by')->unsigned()->nullable();
            $table->softDeletes();
            $table->string('trx_sys_note')->nullable();

            $table->foreign('trx_buyer_id')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('trx_seller_id')->references('usr_id')->on('users')->onDelete('cascade');

            $table->foreign('trx_created_by')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('trx_updated_by')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('trx_deleted_by')->references('usr_id')->on('users')->onDelete('cascade');

            $table->renameColumn('created_at', 'trx_created_at');
            $table->renameColumn('updated_at', 'trx_updated_at');
            $table->renameColumn('deleted_at', 'trx_deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
