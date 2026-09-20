import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import styles from "./ContactContent.module.css";
import { Gradient } from "@/components/effects/Gradient";

export function ContactContent() {
  return (
    <section className={styles.section} aria-label="Contact details and form">
      <Container>
        <div className={styles.grid}>
          <aside className={styles.leftCol}>
            <h2 className={styles.sectionTitle}>
              <span>Our Offices</span> & Contacts
            </h2>

            <div className={styles.contactList}>
              <div className={styles.itemRow}>
                <img
                  src="/images/icons/email-envelope.svg"
                  alt=""
                  aria-hidden="true"
                  className={styles.itemIcon}
                />
                <div className={styles.itemBody}>
                  <p className={styles.eyebrow}>EMAIL</p>
                  <a className={styles.link} href="mailto:info@agivant.com">
                    info@agivant.com
                  </a>
                </div>
              </div>

              <div className={styles.itemRow}>
                <img
                  src="/images/icons/location-pin.svg"
                  alt=""
                  aria-hidden="true"
                  className={styles.itemIcon}
                />
                <div className={styles.itemBody}>
                  <p className={styles.eyebrow}>USA (HEAD QUARTERS)</p>
                  <p className={styles.text}>
                    Agivant Technologies, 84 W Santa Clara St, San Jose, CA
                    95113
                  </p>
                </div>
              </div>

              <div className={styles.itemRow}>
                <img
                  src="/images/icons/location-pin.svg"
                  alt=""
                  aria-hidden="true"
                  className={styles.itemIcon}
                />
                <div className={styles.itemBody}>
                  <p className={styles.eyebrow}>HYDERABAD</p>
                  <p className={styles.text}>
                    Tower A, Tech Park, Hyderabad, Telangana 500081
                  </p>
                  <p className={styles.eyebrow}>PUNE</p>
                  <p className={styles.text}>
                    Tower A, Tech Park, Hyderabad, Telangana 500081
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.socialWrap}>
              <p className={styles.socialTitle}>CONNECT WITH US</p>
              <div className={styles.socialLinks}>
                <a href="#" aria-label="LinkedIn" className={styles.socialLink}>
                  <img
                    src="/images/icons/linkedin.svg"
                    alt=""
                    aria-hidden="true"
                    className={styles.socialIcon}
                  />
                </a>
                <a href="#" aria-label="X" className={styles.socialLink}>
                  <img
                    src="/images/icons/twitter.svg"
                    alt=""
                    aria-hidden="true"
                    className={styles.socialIcon}
                  />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className={styles.socialLink}
                >
                  <img
                    src="/images/icons/instagram.svg"
                    alt=""
                    aria-hidden="true"
                    className={styles.socialIcon}
                  />
                </a>
                <a href="#" aria-label="YouTube" className={styles.socialLink}>
                  <img
                    src="/images/icons/youtube.svg"
                    alt=""
                    aria-hidden="true"
                    className={styles.socialIcon}
                  />
                </a>
              </div>
            </div>
          </aside>
          <Gradient
            top="8%"
            right="-20%"
            size="44rem"
            stops={[
              "color-mix(in srgb, #EDBF79 68%, transparent) 0%",
              "transparent 100%",
            ]}
            opacity={0.35}
            blur="75px"
          />
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>Send us a Message</h3>
            <p className={styles.formLead}>
              We&apos;ll get back to you within 1 business day.
            </p>

            <form className={styles.form}>
              <div className={styles.row}>
                <label className={styles.field}>
                  <span className={styles.label}>First Name</span>
                  <input
                    className={styles.input}
                    name="firstName"
                    placeholder="Jane"
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Last Name</span>
                  <input
                    className={styles.input}
                    name="lastName"
                    placeholder="Doe"
                  />
                </label>
              </div>

              <label className={styles.field}>
                <span className={styles.label}>Work Email</span>
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  placeholder="jane@company.com"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Company Name</span>
                <input
                  className={styles.input}
                  name="company"
                  placeholder="Enterprise Corp"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Phone Number</span>
                <input
                  className={styles.input}
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>How can we help?</span>
                <select className={styles.input} name="reason" defaultValue="">
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="advisory">AI advisory</option>
                  <option value="delivery">
                    Agent delivery and implementation
                  </option>
                  <option value="modernization">Platform modernization</option>
                </select>
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Message</span>
                <textarea
                  className={styles.textarea}
                  name="message"
                  rows={5}
                  placeholder="Tell us about your AI goals and requirements..."
                />
              </label>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className={styles.submit}
              >
                Talk to an Amp'd specialist
              </Button>
            </form>
          </div>
        </div>

        <div className={styles.careersCard}>
          <div className={styles.careersContent}>
            <div className={styles.careersContentInner}>
              <div className={styles.careersContentInnerContent}>
                <h3 className={styles.careersTitle}>
                  <span>Looking to join</span> our team?
                </h3>
                <p className={styles.careersText}>
                  We are always looking for talented individuals to help us
                  grow.
                </p>
                <p className={styles.careersText}>
                  Please visit our <Link href="/careers">Careers Page</Link> to
                  view current openings and submit your application.
                </p>
              </div>
              <div className={styles.careersArt} aria-hidden="true" />
            </div>
          </div>
          {/* <Gradient
            top="8%"
            left="-20%"
            size="22rem"
            stops={[
              "color-mix(in srgb, #EDBF79 68%, transparent) 0%",
              "transparent 100%",
            ]}
            opacity={0.35}
            blur="75px"
          /> */}
          <Gradient
            kind="linear"
            angle="180deg"
            top="25%"
            left="-15%"
            size="24rem"
            stops={[
              "#b31aef33 0%",
              "#f6048d 36%",
              "#f88c54 76%",
              "transparent 100%",
            ]}
            opacity={0.15}
            blur="90px"
          />
        </div>
      </Container>
    </section>
  );
}
