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
        Schema::create('payments', function (Blueprint $table) {
            $table->bigIncrements('pay_id');
            $table->unsignedBigInteger('pay_transaction_id')->unsigned()->nullable();
            $table->string('pay_midtrans_id')->nullable();
            $table->string('pay_method')->nullable();
            $table->enum('pay_status', ['1','2','3','4'])->default('1');
            $table->integer('pay_amount');
            $table->text('pay_qr_url')->nullable();
            $table->json('pay_response')->nullable();
            $table->timestamp('pay_paid_at')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('pay_created_by')->unsigned()->nullable();
            $table->unsignedBigInteger('pay_deleted_by')->unsigned()->nullable();
            $table->unsignedBigInteger('pay_updated_by')->unsigned()->nullable();
            $table->softDeletes();
            $table->string('pay_sys_note')->nullable();

            $table->foreign('pay_transaction_id')->references('trx_id')->on('transactions')->onDelete('cascade');

            $table->foreign('pay_created_by')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('pay_updated_by')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('pay_deleted_by')->references('usr_id')->on('users')->onDelete('cascade');

            $table->renameColumn('created_at', 'pay_created_at');
            $table->renameColumn('updated_at', 'pay_updated_at');
            $table->renameColumn('deleted_at', 'pay_deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
