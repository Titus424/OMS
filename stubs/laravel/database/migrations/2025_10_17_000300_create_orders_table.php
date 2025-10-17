<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained()->cascadeOnDelete();
            $table->string('shopify_order_id')->unique();
            $table->string('customer_name')->nullable();
            $table->string('customer_email')->nullable();
            $table->string('customer_phone')->nullable();
            $table->json('shipping_address')->nullable();
            $table->string('status')->index();
            $table->string('source')->default('shopify');
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('synced_at')->nullable();
            $table->timestamp('last_shopify_tag_sync_at')->nullable();
            $table->decimal('total_price', 12, 2)->default(0);
            $table->string('payment_method')->nullable();
            $table->timestamps();
            $table->index(['status', 'assigned_user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
