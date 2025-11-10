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
        Schema::create('shipments', function (Blueprint $table) {
            $table->bigIncrements('shp_id');
            $table->unsignedBigInteger('shp_transaction_id')->unsigned();
            $table->integer('shp_origin_city_id');
            $table->integer('shp_destination_city_id');
            $table->string('shp_courier')->nullable();
            $table->string('shp_service')->nullable();
            $table->integer('shp_cost')->nullable();
            $table->integer('shp_weight')->nullable();
            $table->string('shp_tracking_code')->nullable();
            $table->enum('shp_status', ['1', '2', '3', '4', '5'])->default('1');
            $table->json('shp_tracking_payload',)->nullable();
            $table->string('shp_tracking_url')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('shp_created_by')->unsigned()->nullable();
            $table->unsignedBigInteger('shp_deleted_by')->unsigned()->nullable();
            $table->unsignedBigInteger('shp_updated_by')->unsigned()->nullable();
            $table->softDeletes();
            $table->string('shp_sys_note')->nullable();

            $table->foreign('shp_transaction_id')->references('trx_id')->on('transactions')->onDelete('cascade');

            $table->foreign('shp_created_by')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('shp_updated_by')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('shp_deleted_by')->references('usr_id')->on('users')->onDelete('cascade');

            $table->renameColumn('created_at', 'shp_created_at');
            $table->renameColumn('updated_at', 'shp_updated_at');
            $table->renameColumn('deleted_at', 'shp_deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
