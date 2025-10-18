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
        Schema::create('products', function (Blueprint $table) {
            $table->bigIncrements('prd_id');
            $table->string('prd_name');
            $table->string('prd_slug')->unique();
            $table->string('prd_img_url')->nullable();
            $table->text('prd_description')->nullable();
            $table->integer('prd_price');
            $table->enum('prd_status', ['1', '2', '3'])->default('3');
            $table->timestamps();
            $table->unsignedBigInteger('prd_created_by')->unsigned()->nullable();
            $table->unsignedBigInteger('prd_deleted_by')->unsigned()->nullable();
            $table->unsignedBigInteger('prd_updated_by')->unsigned()->nullable();
            $table->softDeletes();
            $table->string('prd_sys_note')->nullable();

            $table->foreign('prd_created_by')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('prd_updated_by')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('prd_deleted_by')->references('usr_id')->on('users')->onDelete('cascade');

            $table->renameColumn('created_at', 'prd_created_at');
            $table->renameColumn('updated_at', 'prd_updated_at');
            $table->renameColumn('deleted_at', 'prd_deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
