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
        Schema::create('app_settings', function (Blueprint $table) {
            $table->bigIncrements('app_stg_id');
            $table->string('app_stg_title');
            $table->string('app_stg_value');
            $table->timestamps();
            $table->unsignedBigInteger('app_stg_created_by')->unsigned()->nullable();
            $table->unsignedBigInteger('app_stg_deleted_by')->unsigned()->nullable();
            $table->unsignedBigInteger('app_stg_updated_by')->unsigned()->nullable();
            $table->softDeletes();
            $table->string('app_stg_sys_note')->nullable();

            $table->foreign('app_stg_created_by')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('app_stg_updated_by')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('app_stg_deleted_by')->references('usr_id')->on('users')->onDelete('cascade');

            $table->renameColumn('created_at', 'app_stg_created_at');
            $table->renameColumn('updated_at', 'app_stg_updated_at');
            $table->renameColumn('deleted_at', 'app_stg_deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_settings');
    }
};
