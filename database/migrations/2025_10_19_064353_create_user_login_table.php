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
        Schema::create('user_login', function (Blueprint $table) {
            $table->bigIncrements('usr_lg_id');
            $table->unsignedBigInteger('usr_lg_user_id')->unsigned()->nullable();
            $table->ipAddress('usr_lg_ip_address')->nullable();
            $table->string('usr_lg_user_agent')->nullable();
            $table->string('usr_lg_device_type', 50)->nullable();
            $table->timestamp('usr_lg_logged_in_at')->useCurrent();
            $table->timestamps();
            $table->unsignedBigInteger('usr_lg_created_by')->unsigned()->nullable();
            $table->unsignedBigInteger('usr_lg_deleted_by')->unsigned()->nullable();
            $table->unsignedBigInteger('usr_lg_updated_by')->unsigned()->nullable();
            $table->softDeletes();
            $table->string('usr_lg_sys_note')->nullable();

            $table->foreign('usr_lg_created_by')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('usr_lg_updated_by')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('usr_lg_deleted_by')->references('usr_id')->on('users')->onDelete('cascade');

            $table->renameColumn('updated_at', 'usr_lg_updated_at');
            $table->renameColumn('created_at', 'usr_lg_created_at');
            $table->renameColumn('deleted_at', 'usr_lg_deleted_at');

            $table->foreign('usr_lg_user_id')->references('usr_id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_login');
    }
};
