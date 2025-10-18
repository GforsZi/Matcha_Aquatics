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
        Schema::create('reports', function (Blueprint $table) {
            $table->bigIncrements('rpt_id');
            $table->unsignedBigInteger('rpt_user_id')->unsigned();
            $table->string('rpt_exel_url');
            $table->date('rpt_period_from');
            $table->date('rpt_period_to');
            $table->integer('rpt_total_sales');
            $table->integer('rpt_total_items_sold');
            $table->timestamps();
            $table->unsignedBigInteger('rpt_created_by')->unsigned()->nullable();
            $table->unsignedBigInteger('rpt_deleted_by')->unsigned()->nullable();
            $table->unsignedBigInteger('rpt_updated_by')->unsigned()->nullable();
            $table->softDeletes();
            $table->string('rpt_sys_note')->nullable();

            $table->foreign('rpt_user_id')->references('usr_id')->on('users')->onDelete('cascade');

            $table->foreign('rpt_created_by')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('rpt_updated_by')->references('usr_id')->on('users')->onDelete('cascade');
            $table->foreign('rpt_deleted_by')->references('usr_id')->on('users')->onDelete('cascade');

            $table->renameColumn('created_at', 'rpt_created_at');
            $table->renameColumn('updated_at', 'rpt_updated_at');
            $table->renameColumn('deleted_at', 'rpt_deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
