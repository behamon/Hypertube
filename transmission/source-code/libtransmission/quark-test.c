/*
 * This file Copyright (C) 2013-2014 Mnemosyne LLC
 *
 * It may be used under the GNU GPL versions 2 or 3
 * or any future license endorsed by Mnemosyne LLC.
 *
 * $Id: quark-test.c 14721 2016-03-29 03:04:54Z jordan $
 */

#include <string.h> /* strlen() */

#include "transmission.h"
#include "quark.h"
#include "libtransmission-test.h"

static int
test_static_quarks (void)
{
  int i;

  for (i=0; i<TR_N_KEYS; i++)
    {
      tr_quark q;
      size_t len;
      const char * str;

      str = tr_quark_get_string ((tr_quark)i, &len);
      check_uint_eq (strlen(str), len);
      check (tr_quark_lookup (str, len, &q));
      check_int_eq (i, (int)q);
    }

  for (i=0; i+1<TR_N_KEYS; i++)
    {
      size_t len1, len2;
      const char *str1, *str2;

      str1 = tr_quark_get_string ((tr_quark)i, &len1);
      str2 = tr_quark_get_string ((tr_quark)(i+1), &len2);

      check (strcmp (str1, str2) < 0);
    }

  const tr_quark q = tr_quark_new (NULL, TR_BAD_SIZE);
  check_int_eq (TR_KEY_NONE, (int)q);
  check_streq ("", tr_quark_get_string (q, NULL));

  return 0;
}

MAIN_SINGLE_TEST(test_static_quarks)
