<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */
 
// Include local configuration
if (file_exists(dirname(__FILE__) . '/local-config.php')) {
	include(dirname(__FILE__) . '/local-config.php');
}

// Global DB config
if (!defined('DB_NAME')) {
	define('DB_NAME', 'edibleurban');
}
if (!defined('DB_USER')) {
	define('DB_USER', 'root');
}
if (!defined('DB_PASSWORD')) {
	define('DB_PASSWORD', 'cat');
}
if (!defined('DB_HOST')) {
	define('DB_HOST', 'localhost');
}

/** Database Charset to use in creating database tables. */
if (!defined('DB_CHARSET')) {
	define('DB_CHARSET', 'utf8');
}

/** The Database Collate type. Don't change this if in doubt. */
if (!defined('DB_COLLATE')) {
	define('DB_COLLATE', '');
}

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'T34UCw4.k*l~k#*Oz5OO*wWRj]CfM#o8W:hLTvaQ-kox+2 OIvsWL-LTKx8V|0sT');
define('SECURE_AUTH_KEY',  '@rY!@|w4QdTbHon;jZx :RnLl=@latF/NX)-whPepC#c5=&{m_F,VjnSG}t2m/)Z');
define('LOGGED_IN_KEY',    '%&#Ze-|5zK&k?v9bH/htU=RDAEL7xdtHPpt!)#zj=]s3F)V2=_w)8XSsr&(ZF[cy');
define('NONCE_KEY',        '-DPJ6jzo;f*Vo7*2{2dYJqT?8Iat6)aN~Ogr$+gJiJyHAu+y H`S|9-PUM6D5jm+');
define('AUTH_SALT',        '16J+!qOO4wZYlS/s@IPcU):Z<Yqxf}V)>GPKR,s]>=2@DA|~&_@I@@hP>P9qOpgG');
define('SECURE_AUTH_SALT', '9 +=C(!Z#q:kH+b38<ee- 2X+JVqt[til;h%1|@<DQ,^WDa3Sv5RpgOiPZ^>y[ev');
define('LOGGED_IN_SALT',   '-l;V+<#_v$?HBT7|=nyrAQ5/x-wpFdmwf4NpArcvop4mnkHcv%Mt2)bfk.4VuO;`');
define('NONCE_SALT',       '## el$*n=17mKEj)]:;v:r+N3{>r6U4Gut pQ2(&?x[!C)nj5R7?;OM$u7P#zaqu');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'p1z_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');


/**
 * Set custom paths
 *
 * These are required because wordpress is installed in a subdirectory.
 */
if (!defined('WP_SITEURL')) {
	define('WP_SITEURL', 'http://' . $_SERVER['SERVER_NAME'] . '/wordpress');
}
if (!defined('WP_HOME')) {
	define('WP_HOME',    'http://' . $_SERVER['SERVER_NAME'] . '');
}
if (!defined('WP_CONTENT_DIR')) {
	define('WP_CONTENT_DIR', dirname(__FILE__) . '/content');
}
if (!defined('WP_CONTENT_URL')) {
	define('WP_CONTENT_URL', 'http://' . $_SERVER['SERVER_NAME'] . '/content');
}


/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
if (!defined('WP_DEBUG')) {
	define('WP_DEBUG', false);
}

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
