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
        Schema::create('categories', function (Blueprint $table) {
            $table->bigIncrements('cat_id');
            $table->string('cat_name')->unique();
            $table->string('cat_slug')->unique();
            $table->timestamps();
            $table->unsignedBigInteger('cat_created_by')->unsigned()->nullable();
            $table->unsignedBigInteger('cat_deleted_by')->unsigned()->nullable();
            $table->unsignedBigInteger('cat_updated_by')->unsigned()->nullable();
            $table->softDeletes();
            $table->string('cat_sys_note')->nullable();

            $table->foreign('cat_created_by')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('cat_updated_by')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('cat_deleted_by')->references('usr_id')->on('users')->onDelete('cascade');

            $table->renameColumn('created_at', 'cat_created_at');
            $table->renameColumn('updated_at', 'cat_updated_at');
            $table->renameColumn('deleted_at', 'cat_deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
