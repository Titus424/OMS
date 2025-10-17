<?php

namespace App\Models;

use App\Enums\OrderSource;
use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'shop_id',
        'shopify_order_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'status',
        'source',
        'assigned_user_id',
        'assigned_at',
        'synced_at',
        'last_shopify_tag_sync_at',
        'total_price',
        'payment_method',
    ];

    protected $casts = [
        'shipping_address' => 'array',
        'assigned_at' => 'datetime',
        'synced_at' => 'datetime',
        'last_shopify_tag_sync_at' => 'datetime',
        'total_price' => 'decimal:2',
    ];

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function actions(): HasMany
    {
        return $this->hasMany(OrderAction::class);
    }
}
