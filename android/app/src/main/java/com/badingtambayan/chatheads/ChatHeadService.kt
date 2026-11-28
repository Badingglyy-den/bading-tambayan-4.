package com.badingtambayan.chatheads

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.FrameLayout
import android.widget.TextView
import kotlin.math.abs

class ChatHeadService : Service() {
    private lateinit var windowManager: WindowManager
    private var bubble: View? = null
    private var params: WindowManager.LayoutParams? = null

    override fun onCreate() {
        super.onCreate()
        createChannel()
        val openIntent = PendingIntent.getActivity(
            this, 0, Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val notification: Notification = if (Build.VERSION.SDK_INT >= 26) {
            Notification.Builder(this, "chat_heads")
                .setContentTitle("Bading Tambayan chat head is active")
                .setContentText("Tap the floating 💬 bubble to open your conversations.")
                .setSmallIcon(android.R.drawable.sym_action_chat)
                .setContentIntent(openIntent)
                .setOngoing(true)
                .build()
        } else {
            Notification.Builder(this)
                .setContentTitle("Bading Tambayan chat head is active")
                .setSmallIcon(android.R.drawable.sym_action_chat)
                .setOngoing(true)
                .build()
        }
        startForeground(77, notification)
        showBubble()
    }

    private fun createChannel() {
        if (Build.VERSION.SDK_INT >= 26) {
            val channel = NotificationChannel("chat_heads", "Chat heads", NotificationManager.IMPORTANCE_LOW)
            getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
        }
    }

    private fun showBubble() {
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        val container = FrameLayout(this)
        val head = TextView(this).apply {
            text = "💬"
            textSize = 25f
            gravity = Gravity.CENTER
            setTextColor(0xFFFFFFFF.toInt())
            setBackgroundColor(0xFF7C3AED.toInt())
            elevation = 12f
        }
        val close = TextView(this).apply {
            text = "×"
            textSize = 16f
            gravity = Gravity.CENTER
            setTextColor(0xFFFFFFFF.toInt())
            setBackgroundColor(0xFF29213D.toInt())
            setOnClickListener { removeBubble(); stopSelf() }
        }
        val bubbleSize = (56 * resources.displayMetrics.density).toInt()
        val closeSize = (24 * resources.displayMetrics.density).toInt()
        val headParams = FrameLayout.LayoutParams(bubbleSize, bubbleSize)
        container.addView(head, headParams)
        val closeParams = FrameLayout.LayoutParams(closeSize, closeSize, Gravity.TOP or Gravity.END)
        container.addView(close, closeParams)
        val type = if (Build.VERSION.SDK_INT >= 26) WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else WindowManager.LayoutParams.TYPE_PHONE
        val lp = WindowManager.LayoutParams(
            bubbleSize, bubbleSize, type,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply { gravity = Gravity.TOP or Gravity.END; x = 12; y = 220 }
        container.setOnTouchListener(object : View.OnTouchListener {
            private var startX = 0
            private var startY = 0
            private var downX = 0f
            private var downY = 0f
            private var moved = false
            override fun onTouch(v: View, event: MotionEvent): Boolean {
                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        startX = lp.x; startY = lp.y
                        downX = event.rawX; downY = event.rawY
                        moved = false
                        return true
                    }
                    MotionEvent.ACTION_MOVE -> {
                        val dx = (event.rawX - downX).toInt()
                        val dy = (event.rawY - downY).toInt()
                        if (abs(dx) > 6 || abs(dy) > 6) moved = true
                        lp.x = startX - dx
                        lp.y = startY + dy
                        windowManager.updateViewLayout(container, lp)
                        return true
                    }
                    MotionEvent.ACTION_UP -> {
                        if (!moved) {
                            val launch = Intent(this@ChatHeadService, MainActivity::class.java)
                                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
                            startActivity(launch)
                        }
                        return true
                    }
                }
                return false
            }
        })
        params = lp
        bubble = container
        windowManager.addView(container, lp)
    }

    private fun removeBubble() {
        bubble?.let { try { windowManager.removeView(it) } catch (_: Exception) {} }
        bubble = null
    }

    override fun onDestroy() {
        removeBubble()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
